/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PermitApplication, RequirementItem, UploadedDocument, FlaggedIssue, SignatoryProfessional } from './types/permit';
import { INITIAL_APPLICATIONS } from './data/initialApplications';
import {
  loadApplicationsFromStorage,
  saveApplicationsToStorage,
  getActiveApplicationId,
  setActiveApplicationId,
  calculateCompliance,
} from './utils/storage';
import { Sidebar, ActiveView } from './components/Sidebar';
import { Header } from './components/Header';
import { ApplicationProfileCard } from './components/cards/ApplicationProfileCard';
import { ApplicantCadastralCard } from './components/cards/ApplicantCadastralCard';
import { FinancialValuationCard } from './components/cards/FinancialValuationCard';
import { IssueFlaggingCenter } from './components/cards/IssueFlaggingCenter';
import { DocumentUploadCenter } from './components/cards/DocumentUploadCenter';
import { ProfessionalsRegistryCard } from './components/cards/ProfessionalsRegistryCard';
import { AuditPunchlistRouting } from './components/cards/AuditPunchlistRouting';
import { ApplicantsDatabaseView } from './components/views/ApplicantsDatabaseView';
import { EngineersDatabaseView } from './components/views/EngineersDatabaseView';
import { MasterIssuesView } from './components/views/MasterIssuesView';
import { NewApplicationModal } from './components/modals/NewApplicationModal';
import { AiDocumentAuditModal } from './components/modals/AiDocumentAuditModal';
import { FlagIssueModal } from './components/modals/FlagIssueModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { EditApplicationModal } from './components/modals/EditApplicationModal';
import { AddProfessionalModal } from './components/modals/AddProfessionalModal';
import { PrintableAuditReport } from './components/modals/PrintableAuditReport';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';

export default function App() {
  const [applications, setApplications] = useState<PermitApplication[]>(() =>
    loadApplicationsFromStorage()
  );

  const [activeAppId, setActiveAppId] = useState<string>(() => {
    const saved = getActiveApplicationId();
    const exists = applications.some((a) => a.id === saved);
    return exists ? saved : applications[0]?.id || INITIAL_APPLICATIONS[0].id;
  });

  const [activeView, setActiveView] = useState<ActiveView>('audit-dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isAiAuditModalOpen, setIsAiAuditModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<PermitApplication | null>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagTargetReq, setFlagTargetReq] = useState<RequirementItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [previewReqTitle, setPreviewReqTitle] = useState('');
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<SignatoryProfessional | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<PermitApplication | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    saveApplicationsToStorage(applications);
  }, [applications]);

  useEffect(() => {
    setActiveApplicationId(activeAppId);
  }, [activeAppId]);

  const activeApp =
    applications.find((a) => a.id === activeAppId) || applications[0] || INITIAL_APPLICATIONS[0];

  // Helper to update active application and recalculate audit state
  const updateCurrentApp = (updater: (prevApp: PermitApplication) => PermitApplication) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === activeApp.id) {
          const updated = updater(app);
          const stats = calculateCompliance(updated);
          return {
            ...updated,
            auditSummary: {
              ...updated.auditSummary,
              ...stats,
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return app;
      })
    );
  };

  // Open custom delete confirmation modal
  const handleRequestDelete = (appId: string) => {
    const target = applications.find((a) => a.id === appId);
    if (target) {
      setAppToDelete(target);
      setIsDeleteModalOpen(true);
    }
  };

  // Execute confirmed deletion
  const handleConfirmDelete = () => {
    if (!appToDelete) return;

    setApplications((prev) => {
      const remaining = prev.filter((a) => a.id !== appToDelete.id);
      if (remaining.length === 0) {
        // Fallback to fresh seed application
        return INITIAL_APPLICATIONS;
      }
      if (activeAppId === appToDelete.id) {
        setActiveAppId(remaining[0].id);
      }
      return remaining;
    });

    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  // Upload handler with FileReader
  const handleUploadFile = (requirementId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        dataUrl,
        verifiedBy: 'CBRDGTC Document Processor',
      };

      updateCurrentApp((prev) => ({
        ...prev,
        requirements: prev.requirements.map((req) => {
          if (req.id === requirementId) {
            return {
              ...req,
              status: req.status === 'Flagged with Issues' ? 'Flagged with Issues' : 'Verified',
              uploadedFiles: [...req.uploadedFiles, newDoc],
            };
          }
          return req;
        }),
      }));
    };
    reader.readAsDataURL(file);
  };

  // Delete attached file
  const handleDeleteFile = (requirementId: string, fileId: string) => {
    updateCurrentApp((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req) => {
        if (req.id === requirementId) {
          const remaining = req.uploadedFiles.filter((f) => f.id !== fileId);
          return {
            ...req,
            uploadedFiles: remaining,
            status: remaining.length === 0 ? 'Pending Upload' : req.status,
          };
        }
        return req;
      }),
    }));
  };

  // Toggle requirement verification
  const handleToggleVerification = (requirementId: string) => {
    updateCurrentApp((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req) => {
        if (req.id === requirementId) {
          const nextStatus =
            req.status === 'Verified' ? 'Pending Upload' : 'Verified';
          return {
            ...req,
            status: nextStatus,
          };
        }
        return req;
      }),
    }));
  };

  // Save new flagged issue
  const handleSaveIssue = (issueData: Omit<FlaggedIssue, 'id' | 'flaggedAt' | 'status'>) => {
    const newIssue: FlaggedIssue = {
      ...issueData,
      id: `iss-${Date.now()}`,
      flaggedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Open',
    };

    updateCurrentApp((prev) => {
      let updatedReqs = prev.requirements;
      if (issueData.requirementId) {
        updatedReqs = prev.requirements.map((r) =>
          r.id === issueData.requirementId ? { ...r, status: 'Flagged with Issues' } : r
        );
      }
      return {
        ...prev,
        flaggedIssues: [newIssue, ...prev.flaggedIssues],
        requirements: updatedReqs,
      };
    });
  };

  // Toggle issue resolution on active application or specific application
  const handleToggleIssueStatus = (appId: string, issueId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedIssues = app.flaggedIssues.map((iss) => {
            if (iss.id === issueId) {
              const isResolved = iss.status === 'Resolved';
              return {
                ...iss,
                status: isResolved ? ('Open' as const) : ('Resolved' as const),
                resolvedAt: isResolved
                  ? undefined
                  : new Date().toISOString().replace('T', ' ').slice(0, 16),
                resolvedBy: isResolved ? undefined : 'Engr. Danica Santos (CBRDGTC)',
              };
            }
            return iss;
          });

          const targetIssue = app.flaggedIssues.find((i) => i.id === issueId);
          let updatedReqs = app.requirements;
          if (targetIssue?.requirementId) {
            const remainingOpenForReq = updatedIssues.filter(
              (i) => i.requirementId === targetIssue.requirementId && i.status === 'Open'
            ).length;
            if (remainingOpenForReq === 0) {
              updatedReqs = app.requirements.map((r) =>
                r.id === targetIssue.requirementId
                  ? {
                      ...r,
                      status: r.uploadedFiles.length > 0 ? 'Verified' : 'Pending Upload',
                    }
                  : r
              );
            }
          }

          const updatedApp = {
            ...app,
            flaggedIssues: updatedIssues,
            requirements: updatedReqs,
          };
          const stats = calculateCompliance(updatedApp);
          return {
            ...updatedApp,
            auditSummary: {
              ...updatedApp.auditSummary,
              ...stats,
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
          };
        }
        return app;
      })
    );
  };

  // Delete issue on active application
  const handleDeleteIssue = (issueId: string) => {
    updateCurrentApp((prev) => ({
      ...prev,
      flaggedIssues: prev.flaggedIssues.filter((i) => i.id !== issueId),
    }));
  };

  // Add / Edit Professional
  const handleSaveProfessional = (prof: SignatoryProfessional) => {
    updateCurrentApp((prev) => {
      const exists = prev.professionals.some((p) => p.id === prof.id);
      return {
        ...prev,
        professionals: exists
          ? prev.professionals.map((p) => (p.id === prof.id ? prof : p))
          : [...prev.professionals, prof],
      };
    });
  };

  const handleDeleteProfessional = (profId: string) => {
    updateCurrentApp((prev) => ({
      ...prev,
      professionals: prev.professionals.filter((p) => p.id !== profId),
    }));
  };

  // Reset database to initial sample seed
  const handleResetToSeed = () => {
    setApplications(INITIAL_APPLICATIONS);
    setActiveAppId(INITIAL_APPLICATIONS[0].id);
    saveApplicationsToStorage(INITIAL_APPLICATIONS);
  };

  // Export database as JSON file
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `General_Trias_Building_Permits_DB_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Print audit report
  const handlePrintReport = () => {
    window.print();
  };

  // Handle open audit for a specific app from database views
  const handleOpenAudit = (appId: string) => {
    setActiveAppId(appId);
    setActiveView('audit-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex antialiased">
      {/* Printable official report */}
      <PrintableAuditReport app={activeApp} />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        applications={applications}
        activeAppId={activeAppId}
        onSelectApplication={(id) => setActiveAppId(id)}
        onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
        onOpenAiAuditModal={() => setIsAiAuditModalOpen(true)}
        onDeleteApplication={(id) => handleRequestDelete(id)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          applications={applications}
          activeApp={activeApp}
          activeView={activeView}
          onSelectApplication={(id) => setActiveAppId(id)}
          onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
          onOpenAiAuditModal={() => setIsAiAuditModalOpen(true)}
          onResetToSeed={handleResetToSeed}
          onExportJson={handleExportJson}
          onPrintReport={handlePrintReport}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((o) => !o)}
        />

        {/* Dynamic View Viewport */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 no-print">
          {activeView === 'audit-dashboard' && (
            <>
              {/* Bento Grid Top Section: 3 Metric & Identity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                <ApplicationProfileCard
                  app={activeApp}
                  onEdit={() => {
                    setAppToEdit(activeApp);
                    setIsEditAppModalOpen(true);
                  }}
                  onDelete={() => handleRequestDelete(activeApp.id)}
                />

                <ApplicantCadastralCard
                  app={activeApp}
                  onEdit={() => {
                    setAppToEdit(activeApp);
                    setIsEditAppModalOpen(true);
                  }}
                />

                <FinancialValuationCard
                  app={activeApp}
                  onEdit={() => {
                    setAppToEdit(activeApp);
                    setIsEditAppModalOpen(true);
                  }}
                />
              </div>

              {/* Bento Grid Middle Section: Discrepancy & Issue Flagging Center */}
              <IssueFlaggingCenter
                issues={activeApp.flaggedIssues}
                onOpenAddIssueModal={() => {
                  setFlagTargetReq(null);
                  setIsFlagModalOpen(true);
                }}
                onToggleIssueStatus={(issueId) => handleToggleIssueStatus(activeApp.id, issueId)}
                onDeleteIssue={handleDeleteIssue}
              />

              {/* Bento Grid Main Section: 16-Point Requirements Checklist & File Upload Center */}
              <DocumentUploadCenter
                requirements={activeApp.requirements}
                onUploadFile={handleUploadFile}
                onDeleteFile={handleDeleteFile}
                onToggleVerification={handleToggleVerification}
                onOpenFlagModalForDoc={(req) => {
                  setFlagTargetReq(req);
                  setIsFlagModalOpen(true);
                }}
                onPreviewDocument={(doc, title) => {
                  setPreviewDoc(doc);
                  setPreviewReqTitle(title);
                  setIsPreviewModalOpen(true);
                }}
              />

              {/* Bento Grid Bottom Section: Signatory Professionals Registry */}
              <ProfessionalsRegistryCard
                professionals={activeApp.professionals}
                onOpenAddProfessionalModal={() => {
                  setEditingProfessional(null);
                  setIsProfessionalModalOpen(true);
                }}
                onEditProfessional={(prof) => {
                  setEditingProfessional(prof);
                  setIsProfessionalModalOpen(true);
                }}
                onDeleteProfessional={handleDeleteProfessional}
              />

              {/* Actionable Punchlist & Official Endorsement Routing */}
              <AuditPunchlistRouting
                app={activeApp}
                onPrintReport={handlePrintReport}
              />
            </>
          )}

          {activeView === 'applicants-database' && (
            <ApplicantsDatabaseView
              applications={applications}
              onSelectApplication={(id) => setActiveAppId(id)}
              onOpenAudit={handleOpenAudit}
              onEditApplication={(app) => {
                setAppToEdit(app);
                setIsEditAppModalOpen(true);
              }}
              onDeleteApplication={(id) => handleRequestDelete(id)}
              onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
            />
          )}

          {activeView === 'engineers-database' && (
            <EngineersDatabaseView
              applications={applications}
              onOpenAudit={handleOpenAudit}
              onOpenAddProfessional={() => {
                setEditingProfessional(null);
                setIsProfessionalModalOpen(true);
              }}
              onEditProfessional={(prof, appId) => {
                setActiveAppId(appId);
                setEditingProfessional(prof);
                setIsProfessionalModalOpen(true);
              }}
            />
          )}

          {activeView === 'master-issues' && (
            <MasterIssuesView
              applications={applications}
              onOpenAudit={handleOpenAudit}
              onToggleIssueStatus={handleToggleIssueStatus}
              onOpenAddIssueModal={() => {
                setFlagTargetReq(null);
                setIsFlagModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 font-medium no-print">
          <p>
            City Government of General Trias, Cavite · Office of the Building Official (CBRDGTC) ·
            Building Permit Application Tracking & Verification System
          </p>
        </footer>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAppToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        app={appToDelete}
      />

      {/* AI Document Audit & Auto-Fill Modal */}
      <AiDocumentAuditModal
        isOpen={isAiAuditModalOpen}
        onClose={() => setIsAiAuditModalOpen(false)}
        onCommitApplication={(newApp) => {
          setApplications((prev) => [newApp, ...prev]);
          setActiveAppId(newApp.id);
          setActiveView('audit-dashboard');
        }}
      />

      {/* Manual New Application Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onCreateApplication={(newApp) => {
          setApplications((prev) => [newApp, ...prev]);
          setActiveAppId(newApp.id);
          setActiveView('audit-dashboard');
        }}
        onOpenAiAuditModal={() => setIsAiAuditModalOpen(true)}
      />

      <EditApplicationModal
        isOpen={isEditAppModalOpen}
        onClose={() => {
          setIsEditAppModalOpen(false);
          setAppToEdit(null);
        }}
        app={appToEdit || activeApp}
        onSave={(updated) => {
          setApplications((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
          );
        }}
      />

      <FlagIssueModal
        isOpen={isFlagModalOpen}
        onClose={() => {
          setIsFlagModalOpen(false);
          setFlagTargetReq(null);
        }}
        targetRequirement={flagTargetReq}
        onSaveIssue={handleSaveIssue}
      />

      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewDoc(null);
        }}
        document={previewDoc}
        requirementTitle={previewReqTitle}
      />

      <AddProfessionalModal
        isOpen={isProfessionalModalOpen}
        onClose={() => {
          setIsProfessionalModalOpen(false);
          setEditingProfessional(null);
        }}
        professionalToEdit={editingProfessional}
        onSaveProfessional={handleSaveProfessional}
      />
    </div>
  );
}
