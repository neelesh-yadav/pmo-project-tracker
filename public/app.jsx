import React, { useState, useMemo } from 'react';
import { Search, Download, RefreshCw, Plus, ChevronDown, ChevronUp, MoreVertical, X, Edit2, Trash2, Network, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const PMOProjectTracker = () => {
  const [currentUser, setCurrentUser] = useState({ 
    id: 1, 
    name: 'Neelesh Yadav', 
    role: 'PMO',
    initials: 'NY' 
  });

  const [projectManagers, setProjectManagers] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', phone: '+1-234-567-8901', initials: 'JS', assignedProjects: [1, 5] },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@company.com', phone: '+1-234-567-8902', initials: 'JD', assignedProjects: [2] },
    { id: 3, name: 'Robert Lee', email: 'robert.lee@company.com', phone: '+1-234-567-8903', initials: 'RL', assignedProjects: [3] },
    { id: 4, name: 'Maria Garcia', email: 'maria.garcia@company.com', phone: '+1-234-567-8904', initials: 'MG', assignedProjects: [4] },
  ]);

  const [resources, setResources] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Senior Developer', email: 'sarah.chen@company.com', plannedCapacity: 40, skills: ['React', 'Node.js', 'AWS'] },
    { id: 2, name: 'Marcus Johnson', role: 'Full Stack Developer', email: 'marcus.j@company.com', plannedCapacity: 40, skills: ['Python', 'Django'] },
    { id: 3, name: 'Priya Sharma', role: 'UI/UX Designer', email: 'priya.sharma@company.com', plannedCapacity: 40, skills: ['Figma'] },
    { id: 4, name: 'David Kim', role: 'DevOps Engineer', email: 'david.kim@company.com', plannedCapacity: 40, skills: ['Kubernetes'] },
    { id: 5, name: 'Emma Rodriguez', role: 'Backend Developer', email: 'emma.r@company.com', plannedCapacity: 40, skills: ['Java'] },
    { id: 6, name: 'James Anderson', role: 'Frontend Developer', email: 'james.a@company.com', plannedCapacity: 40, skills: ['Vue.js'] },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1, caseId: 'PRJ-2026-001', name: 'Customer Portal Redesign', pmId: 1, status: 'In Progress', health: 'On Track',
      priority: 'High', type: 'Internal', branch: 'Technology', startDate: '2026-01-01', endDate: '2026-04-30',
      budget: 250000, spent: 125000, progress: 55, tat: '<1d', dependencies: [],
      resources: [
        { resourceId: 1, allocation: 80, actualEffort: 320, role: 'Lead Dev' },
        { resourceId: 3, allocation: 60, actualEffort: 180, role: 'Designer' },
      ],
      milestones: [
        { id: 'm1', name: 'Design Complete', date: '2026-02-15', status: 'Completed' },
        { id: 'm2', name: 'Alpha Release', date: '2026-03-15', status: 'At Risk' },
      ],
      createdBy: 'Neelesh Yadav', createdDate: '2026-01-01T10:00:00'
    },
    {
      id: 2, caseId: 'PRJ-2026-002', name: 'API Gateway Migration', pmId: 2, status: 'In Progress', health: 'At Risk',
      priority: 'Critical', type: 'Infrastructure', branch: 'Engineering', startDate: '2025-12-01', endDate: '2026-03-31',
      budget: 180000, spent: 145000, progress: 72, tat: '<1d', dependencies: [],
      resources: [
        { resourceId: 2, allocation: 100, actualEffort: 580, role: 'Backend Lead' },
        { resourceId: 4, allocation: 80, actualEffort: 450, role: 'DevOps' },
      ],
      milestones: [
        { id: 'm4', name: 'Infrastructure Setup', date: '2026-01-15', status: 'Completed' },
        { id: 'm5', name: 'Migration Complete', date: '2026-03-01', status: 'Delayed' },
      ],
      createdBy: 'Neelesh Yadav', createdDate: '2025-12-01T09:30:00'
    },
    {
      id: 3, caseId: 'PRJ-2026-003', name: 'Mobile App v2.0', pmId: 3, status: 'Planning', health: 'On Track',
      priority: 'High', type: 'Product', branch: 'Mobile', startDate: '2026-02-01', endDate: '2026-07-31',
      budget: 320000, spent: 45000, progress: 15, tat: '2d',
      dependencies: [{ upstreamId: 2, type: 'Finish-to-Start', critical: true }],
      resources: [],
      milestones: [],
      createdBy: 'Robert Lee', createdDate: '2026-01-15T14:20:00'
    },
  ]);

  const [activeView, setActiveView] = useState('queue');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddPMModal, setShowAddPMModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const [newProject, setNewProject] = useState({
    name: '', pmId: '', status: 'Planning', health: 'On Track', priority: 'Medium',
    type: 'Internal', branch: 'Technology', startDate: '', endDate: '', budget: ''
  });

  const [newPM, setNewPM] = useState({ name: '', email: '', phone: '', initials: '' });

  const calculateResourceUtilization = (resource) => {
    let totalAllocation = 0;
    projects.forEach(project => {
      if (project.status !== 'Completed') {
        const assignment = project.resources.find(r => r.resourceId === resource.id);
        if (assignment) totalAllocation += assignment.allocation;
      }
    });
    return {
      planned: resource.plannedCapacity,
      actual: totalAllocation,
      utilization: (totalAllocation / resource.plannedCapacity) * 100,
      available: resource.plannedCapacity - totalAllocation
    };
  };

  const stats = useMemo(() => {
    return {
      total: projects.length,
      approved: projects.filter(p => p.status === 'Completed').length,
      pending: projects.filter(p => p.status === 'Planning').length,
      rejected: projects.filter(p => p.status === 'Cancelled').length,
      actual: projects.filter(p => p.status === 'In Progress').length,
      breach: projects.filter(p => p.health === 'At Risk').length,
    };
  }, [projects]);

  const capacityMetrics = useMemo(() => {
    const metrics = { totalCapacity: 0, totalDemand: 0, available: 0, overallocated: 0, underutilized: 0, optimal: 0 };
    resources.forEach(resource => {
      const util = calculateResourceUtilization(resource);
      metrics.totalCapacity += util.planned;
      metrics.totalDemand += util.actual;
      metrics.available += Math.max(0, util.available);
      if (util.utilization > 100) metrics.overallocated++;
      else if (util.utilization < 60) metrics.underutilized++;
      else metrics.optimal++;
    });
    return metrics;
  }, [resources, projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.caseId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
      
      if (currentUser.role === 'PM') {
        const pm = projectManagers.find(pm => pm.name === currentUser.name);
        if (pm && !pm.assignedProjects.includes(project.id)) return false;
      }
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField];
      if (sortField === 'pmId') {
        const pmA = projectManagers.find(pm => pm.id === a.pmId);
        const pmB = projectManagers.find(pm => pm.id === b.pmId);
        aVal = pmA ? pmA.name : '';
        bVal = pmB ? pmB.name : '';
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchTerm, filterStatus, filterPriority, sortField, sortDirection]);

  const handleAddProject = () => {
    if (!newProject.name || !newProject.pmId) {
      alert('Please fill in required fields');
      return;
    }

    const project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      caseId: `PRJ-2026-${String(projects.length + 1).padStart(3, '0')}`,
      ...newProject,
      budget: parseFloat(newProject.budget) || 0,
      spent: 0, progress: 0, tat: '<1d', resources: [], milestones: [],
      createdBy: currentUser.name,
      createdDate: new Date().toISOString()
    };

    setProjects([...projects, project]);
    
    const pm = projectManagers.find(p => p.id === parseInt(newProject.pmId));
    if (pm) {
      setProjectManagers(projectManagers.map(p => 
        p.id === pm.id ? { ...p, assignedProjects: [...p.assignedProjects, project.id] } : p
      ));
    }

    setShowAddProjectModal(false);
    setNewProject({
      name: '', pmId: '', status: 'Planning', health: 'On Track', priority: 'Medium',
      type: 'Internal', branch: 'Technology', startDate: '', endDate: '', budget: ''
    });
  };

  const handleAddPM = () => {
    if (!newPM.name || !newPM.email) {
      alert('Please fill in required fields');
      return;
    }

    const initials = newPM.initials || newPM.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const pm = {
      id: Math.max(...projectManagers.map(p => p.id), 0) + 1,
      ...newPM, initials, assignedProjects: []
    };

    setProjectManagers([...projectManagers, pm]);
    setShowAddPMModal(false);
    setNewPM({ name: '', email: '', phone: '', initials: '' });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="pmo-app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8L16 14L28 8L16 2Z" fill="#8B1538" stroke="#8B1538" strokeWidth="2"/>
              <path d="M4 14L16 20L28 14" stroke="#8B1538" strokeWidth="2" fill="none"/>
              <path d="M4 20L16 26L28 20" stroke="#8B1538" strokeWidth="2" fill="none"/>
            </svg>
            <div className="logo-text">
              <span className="logo-title">PMO TRACKER</span>
              <span className="logo-subtitle">PROJECT MANAGEMENT</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <span className="user-name">{currentUser.name}</span>
          <div className="user-role-badge">{currentUser.role}</div>
          <div className="user-avatar">
            {currentUser.initials}
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <button className={`nav-btn ${activeView === 'queue' ? 'active' : ''}`} onClick={() => setActiveView('queue')}>
          Project Queue
        </button>
        <button className={`nav-btn ${activeView === 'capacity' ? 'active' : ''}`} onClick={() => setActiveView('capacity')}>
          Capacity Planning
        </button>
        <button className={`nav-btn ${activeView === 'dependencies' ? 'active' : ''}`} onClick={() => setActiveView('dependencies')}>
          Dependencies
        </button>
        {currentUser.role === 'PMO' && (
          <button className={`nav-btn ${activeView === 'pms' ? 'active' : ''}`} onClick={() => setActiveView('pms')}>
            Project Managers
          </button>
        )}
      </nav>

      <main className="main-container">
        {activeView === 'queue' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Project Queue</h1>
                <p className="page-subtitle">Manage and review project portfolio</p>
              </div>
              {(currentUser.role === 'PMO' || currentUser.role === 'PM') && (
                <button className="btn-primary" onClick={() => setShowAddProjectModal(true)}>
                  <Download size={16} />
                  New Project
                </button>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">TOTAL</div>
              </div>
              <div className="stat-card green">
                <div className="stat-value">{stats.approved}</div>
                <div className="stat-label">APPROVED</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">PENDING</div>
              </div>
              <div className="stat-card red">
                <div className="stat-value">{stats.rejected}</div>
                <div className="stat-label">REJECTED</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-value">{stats.actual}</div>
                <div className="stat-label">ACTUAL</div>
              </div>
              <div className="stat-card gray">
                <div className="stat-value">{stats.breach}</div>
                <div className="stat-label">BREACH</div>
              </div>
            </div>

            <div className="filters-bar">
              <div className="filters-label">Filters:</div>
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search Case ID..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                <option value="all">Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
                <option value="all">Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
              <button className="clear-btn" onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPriority('all');
              }}>Clear</button>
            </div>

            <div className="table-container">
              <div className="table-header-row">
                <div className="table-header-left">
                  <h3>Project Queue ({filteredProjects.length} projects)</h3>
                </div>
                <button className="refresh-btn">
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('caseId')}>
                      CASE ID {sortField === 'caseId' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </th>
                    <th onClick={() => handleSort('name')}>
                      PROJECT NAME {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </th>
                    <th onClick={() => handleSort('pmId')}>PM</th>
                    <th onClick={() => handleSort('budget')}>AMOUNT</th>
                    <th onClick={() => handleSort('startDate')}>STARTED</th>
                    <th>COMPLETED</th>
                    <th>CREATED BY</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                    <th>TAT</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const pm = projectManagers.find(p => p.id === project.pmId);
                    return (
                      <tr key={project.id} onClick={() => {
                        setSelectedProject(project);
                        setShowProjectDetailModal(true);
                      }}>
                        <td>{project.caseId}</td>
                        <td className="project-name-cell">{project.name}</td>
                        <td>{pm ? pm.name : 'Unassigned'}</td>
                        <td>Rs {(project.budget / 100000).toFixed(2)} Cr</td>
                        <td>{new Date(project.startDate).toLocaleDateString('en-GB')}</td>
                        <td>{project.progress === 100 ? new Date(project.endDate).toLocaleDateString('en-GB') : '-'}</td>
                        <td>{project.createdBy}</td>
                        <td>{project.type}</td>
                        <td>
                          <span className={`status-badge ${
                            project.status === 'In Progress' ? 'partial' : 
                            project.status === 'Completed' ? 'approved' : 
                            project.status === 'Cancelled' ? 'rejected' : 'pending'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td><span className="tat-badge">{project.tat}</span></td>
                        <td>
                          <button className="menu-btn" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeView === 'capacity' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Resource Capacity Planning</h1>
                <p className="page-subtitle">Monitor resource utilization and availability</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{resources.length}</div>
                <div className="stat-label">TOTAL RESOURCES</div>
              </div>
              <div className="stat-card green">
                <div className="stat-value">{capacityMetrics.optimal}</div>
                <div className="stat-label">OPTIMAL</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-value">{capacityMetrics.underutilized}</div>
                <div className="stat-label">UNDER-UTILIZED</div>
              </div>
              <div className="stat-card red">
                <div className="stat-value">{capacityMetrics.overallocated}</div>
                <div className="stat-label">OVER-ALLOCATED</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-value">{Math.round((capacityMetrics.totalDemand / capacityMetrics.totalCapacity) * 100)}%</div>
                <div className="stat-label">UTILIZATION</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{capacityMetrics.available}h</div>
                <div className="stat-label">AVAILABLE</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header-row">
                <h3>Resource Utilization ({resources.length} resources)</h3>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RESOURCE NAME</th>
                    <th>ROLE</th>
                    <th>EMAIL</th>
                    <th>CAPACITY</th>
                    <th>ALLOCATION</th>
                    <th>UTILIZATION</th>
                    <th>AVAILABLE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map(resource => {
                    const util = calculateResourceUtilization(resource);
                    const percentage = util.utilization;
                    let status = 'Optimal', statusClass = 'partial';
                    if (percentage > 100) { status = 'Over-allocated'; statusClass = 'rejected'; }
                    else if (percentage < 60) { status = 'Under-utilized'; statusClass = 'pending'; }
                    
                    return (
                      <tr key={resource.id}>
                        <td className="project-name-cell">{resource.name}</td>
                        <td>{resource.role}</td>
                        <td>{resource.email}</td>
                        <td>{util.planned}h/week</td>
                        <td>{util.actual}h/week</td>
                        <td>
                          <div className="utilization-bar-wrapper">
                            <div className="utilization-bar">
                              <div className={`utilization-fill ${statusClass}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                            </div>
                            <span className="utilization-text">{Math.round(percentage)}%</span>
                          </div>
                        </td>
                        <td>{util.available}h</td>
                        <td><span className={`status-badge ${statusClass}`}>{status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeView === 'pms' && currentUser.role === 'PMO' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Project Managers</h1>
                <p className="page-subtitle">Manage project manager assignments</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddPMModal(true)}>
                <Plus size={16} />
                Add PM
              </button>
            </div>

            <div className="pm-grid">
              {projectManagers.map(pm => {
                const assignedProjects = projects.filter(p => pm.assignedProjects.includes(p.id));
                const inProgress = assignedProjects.filter(p => p.status === 'In Progress').length;
                
                return (
                  <div key={pm.id} className="pm-card">
                    <div className="pm-card-header">
                      <div className="pm-avatar-large">{pm.initials}</div>
                      <div className="pm-info">
                        <h3>{pm.name}</h3>
                        <p>{pm.email}</p>
                        <p>{pm.phone}</p>
                      </div>
                    </div>
                    <div className="pm-stats">
                      <div className="pm-stat">
                        <span className="pm-stat-value">{pm.assignedProjects.length}</span>
                        <span className="pm-stat-label">Total Projects</span>
                      </div>
                      <div className="pm-stat">
                        <span className="pm-stat-value">{inProgress}</span>
                        <span className="pm-stat-label">In Progress</span>
                      </div>
                    </div>
                    <div className="pm-projects">
                      <h4>Assigned Projects</h4>
                      {assignedProjects.length > 0 ? (
                        <div className="pm-project-list">
                          {assignedProjects.map(project => (
                            <div key={project.id} className="pm-project-item">
                              <span>{project.name}</span>
                              <span className={`status-badge small ${
                                project.status === 'In Progress' ? 'partial' : 
                                project.status === 'Completed' ? 'approved' : 'pending'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-projects">No projects assigned</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {showAddProjectModal && (
        <div className="modal-overlay" onClick={() => setShowAddProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Project</h2>
              <button className="close-btn" onClick={() => setShowAddProjectModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Project Name *</label>
                  <input type="text" value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Enter project name" />
                </div>
                <div className="form-group">
                  <label>Project Manager *</label>
                  <select value={newProject.pmId}
                    onChange={(e) => setNewProject({...newProject, pmId: e.target.value})}>
                    <option value="">Select PM</option>
                    {projectManagers.map(pm => (
                      <option key={pm.id} value={pm.id}>{pm.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={newProject.type}
                    onChange={(e) => setNewProject({...newProject, type: e.target.value})}>
                    <option value="Internal">Internal</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Product">Product</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select value={newProject.branch}
                    onChange={(e) => setNewProject({...newProject, branch: e.target.value})}>
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Data">Data</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget (Crores)</label>
                  <input type="number" step="0.01" value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddProjectModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddProject}>Add Project</button>
            </div>
          </div>
        </div>
      )}

      {showAddPMModal && (
        <div className="modal-overlay" onClick={() => setShowAddPMModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Project Manager</h2>
              <button className="close-btn" onClick={() => setShowAddPMModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input type="text" value={newPM.name}
                    onChange={(e) => setNewPM({...newPM, name: e.target.value})}
                    placeholder="Enter full name" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={newPM.email}
                    onChange={(e) => setNewPM({...newPM, email: e.target.value})}
                    placeholder="email@company.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={newPM.phone}
                    onChange={(e) => setNewPM({...newPM, phone: e.target.value})}
                    placeholder="+1-234-567-8900" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddPMModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddPM}>Add PM</button>
            </div>
          </div>
        </div>
      )}

      {showProjectDetailModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowProjectDetailModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedProject.name}</h2>
                <p className="modal-subtitle">{selectedProject.caseId}</p>
              </div>
              <button className="close-btn" onClick={() => setShowProjectDetailModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-badges">
                <span className={`badge priority-${selectedProject.priority.toLowerCase()}`}>
                  {selectedProject.priority}
                </span>
                <span className={`badge status-${selectedProject.status.replace(' ', '-').toLowerCase()}`}>
                  {selectedProject.status}
                </span>
                <span className={`badge health-${selectedProject.health.replace(' ', '-').toLowerCase()}`}>
                  {selectedProject.health}
                </span>
              </div>

              <div className="detail-section">
                <h3>Project Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Project Manager</span>
                    <span className="detail-value">
                      {projectManagers.find(pm => pm.id === selectedProject.pmId)?.name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Branch</span>
                    <span className="detail-value">{selectedProject.branch}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{selectedProject.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">Rs {(selectedProject.budget / 100000).toFixed(2)} Cr</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Progress</span>
                    <span className="detail-value">{selectedProject.progress}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Assigned Resources ({selectedProject.resources.length})</h3>
                {selectedProject.resources.length > 0 ? (
                  <div className="resource-list">
                    {selectedProject.resources.map(assignment => {
                      const resource = resources.find(r => r.id === assignment.resourceId);
                      return resource ? (
                        <div key={assignment.resourceId} className="resource-item">
                          <div>
                            <strong>{resource.name}</strong>
                            <span>{assignment.role}</span>
                          </div>
                          <div>
                            <span>Allocation: {assignment.allocation}%</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="empty-message">No resources assigned yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; color: #1d1d1f; }
        .pmo-app { min-height: 100vh; display: flex; flex-direction: column; }
        
        .app-header { background: white; border-bottom: 1px solid #e5e5e7; padding: 0 2rem; height: 70px; display: flex; align-items: center; justify-content: space-between; }
        .header-left, .header-right { display: flex; align-items: center; gap: 1rem; }
        .logo { display: flex; align-items: center; gap: 0.75rem; }
        .logo-text { display: flex; flex-direction: column; }
        .logo-title { font-size: 1.1rem; font-weight: 700; color: #8B1538; letter-spacing: -0.5px; }
        .logo-subtitle { font-size: 0.7rem; color: #6e6e73; text-transform: uppercase; letter-spacing: 1px; }
        .user-name { font-size: 0.95rem; font-weight: 500; color: #1d1d1f; }
        .user-role-badge { padding: 0.35rem 0.75rem; background: #f5f5f7; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #6e6e73; }
        .user-avatar { width: 36px; height: 36px; background: #8B1538; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.85rem; cursor: pointer; position: relative; }
        .user-avatar svg { position: absolute; bottom: -2px; right: -2px; }
        
        .main-nav { background: white; border-bottom: 1px solid #e5e5e7; padding: 0 2rem; display: flex; gap: 0.5rem; }
        .nav-btn { padding: 1rem 1.5rem; background: transparent; border: none; border-bottom: 3px solid transparent; color: #6e6e73; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .nav-btn:hover { color: #1d1d1f; background: #f5f5f7; }
        .nav-btn.active { color: #8B1538; border-bottom-color: #8B1538; }
        
        .main-container { flex: 1; padding: 2rem; max-width: 1600px; width: 100%; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .page-title { font-size: 1.75rem; font-weight: 600; color: #1d1d1f; margin-bottom: 0.25rem; }
        .page-subtitle { font-size: 0.95rem; color: #6e6e73; }
        
        .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #8B1538; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #6d0f29; transform: translateY(-1px); }
        .btn-secondary { padding: 0.75rem 1.25rem; background: white; color: #1d1d1f; border: 1px solid #d2d2d7; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; border: 1px solid #e5e5e7; border-radius: 12px; padding: 1.5rem; text-align: center; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #1d1d1f; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.75rem; color: #6e6e73; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .stat-card.green .stat-value { color: #34c759; }
        .stat-card.orange .stat-value { color: #ff9500; }
        .stat-card.red .stat-value { color: #dc2626; }
        .stat-card.blue .stat-value { color: #007aff; }
        .stat-card.gray .stat-value { color: #6e6e73; }
        
        .filters-bar { background: white; border: 1px solid #e5e5e7; border-radius: 12px; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .filters-label { font-weight: 600; color: #1d1d1f; }
        .search-box { flex: 1; max-width: 300px; position: relative; display: flex; align-items: center; }
        .search-box svg { position: absolute; left: 12px; color: #6e6e73; }
        .search-box input { width: 100%; padding: 0.65rem 0.75rem 0.65rem 2.5rem; border: 1px solid #d2d2d7; border-radius: 8px; font-size: 0.9rem; }
        .search-box input:focus { outline: none; border-color: #8B1538; }
        .filter-select { padding: 0.65rem 2rem 0.65rem 0.75rem; border: 1px solid #d2d2d7; border-radius: 8px; font-size: 0.9rem; background: white; color: #6e6e73; cursor: pointer; }
        .clear-btn { padding: 0.65rem 1rem; background: transparent; color: #8B1538; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        
        .table-container { background: white; border: 1px solid #e5e5e7; border-radius: 12px; overflow: hidden; }
        .table-header-row { background: #f9f2f4; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e5e7; }
        .table-header-left h3 { font-size: 1.1rem; font-weight: 600; color: #8B1538; }
        .refresh-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: white; border: 1px solid #d2d2d7; border-radius: 8px; color: #1d1d1f; font-size: 0.85rem; cursor: pointer; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { background: #f5f5f7; }
        .data-table th { text-align: left; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #8B1538; text-transform: uppercase; cursor: pointer; }
        .data-table th svg { display: inline; vertical-align: middle; margin-left: 4px; }
        .data-table tbody tr { border-bottom: 1px solid #f5f5f7; transition: background 0.2s; cursor: pointer; }
        .data-table tbody tr:hover { background: #fafafa; }
        .data-table td { padding: 1rem 1.5rem; font-size: 0.9rem; color: #1d1d1f; }
        .project-name-cell { font-weight: 600; color: #1d1d1f; }
        
        .status-badge { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .status-badge.approved { background: #d1f4e0; color: #0c6b39; }
        .status-badge.partial { background: #fff4e6; color: #e67700; }
        .status-badge.rejected { background: #ffe0e0; color: #c41e3a; }
        .status-badge.pending { background: #e6f0ff; color: #0056b3; }
        .status-badge.small { padding: 0.25rem 0.5rem; font-size: 0.7rem; }
        .tat-badge { display: inline-block; padding: 0.35rem 0.75rem; background: #d1f4e0; color: #0c6b39; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .menu-btn { padding: 0.35rem; background: transparent; border: none; border-radius: 6px; color: #6e6e73; cursor: pointer; }
        
        .utilization-bar-wrapper { display: flex; align-items: center; gap: 0.75rem; }
        .utilization-bar { flex: 1; height: 8px; background: #f5f5f7; border-radius: 10px; overflow: hidden; }
        .utilization-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }
        .utilization-fill.approved { background: #34c759; }
        .utilization-fill.partial { background: #ff9500; }
        .utilization-fill.rejected { background: #dc2626; }
        .utilization-text { font-size: 0.85rem; font-weight: 600; color: #1d1d1f; min-width: 45px; text-align: right; }
        
        .pm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .pm-card { background: white; border: 1px solid #e5e5e7; border-radius: 12px; padding: 1.5rem; }
        .pm-card-header { display: flex; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f5f5f7; }
        .pm-avatar-large { width: 60px; height: 60px; background: #8B1538; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.25rem; }
        .pm-info h3 { font-size: 1.1rem; color: #1d1d1f; margin-bottom: 0.5rem; }
        .pm-info p { font-size: 0.85rem; color: #6e6e73; margin-bottom: 0.25rem; }
        .pm-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f5f5f7; }
        .pm-stat { text-align: center; }
        .pm-stat-value { display: block; font-size: 1.75rem; font-weight: 700; color: #1d1d1f; margin-bottom: 0.25rem; }
        .pm-stat-label { display: block; font-size: 0.75rem; color: #6e6e73; text-transform: uppercase; }
        .pm-projects h4 { font-size: 0.9rem; color: #1d1d1f; margin-bottom: 1rem; }
        .pm-project-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .pm-project-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #fafafa; border-radius: 8px; font-size: 0.9rem; }
        .no-projects { padding: 2rem; text-align: center; color: #6e6e73; font-size: 0.9rem; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .modal-content.large { max-width: 900px; }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 2rem; border-bottom: 1px solid #e5e5e7; }
        .modal-header h2 { font-size: 1.5rem; color: #1d1d1f; }
        .modal-subtitle { font-size: 0.9rem; color: #6e6e73; margin-top: 0.25rem; }
        .close-btn { padding: 0.5rem; background: #f5f5f7; border: none; border-radius: 8px; color: #6e6e73; cursor: pointer; }
        .modal-body { padding: 2rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding: 1.5rem 2rem; border-top: 1px solid #e5e5e7; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { font-size: 0.9rem; font-weight: 600; color: #1d1d1f; }
        .form-group input, .form-group select { padding: 0.75rem; border: 1px solid #d2d2d7; border-radius: 8px; font-size: 0.9rem; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #8B1538; }
        
        .detail-badges { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .badge { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
        .badge.priority-critical { background: #ffe0e0; color: #c41e3a; }
        .badge.priority-high { background: #fff4e6; color: #e67700; }
        .badge.priority-medium { background: #e6f0ff; color: #0056b3; }
        .badge.status-in-progress { background: #fff4e6; color: #e67700; }
        .badge.status-planning { background: #e6f0ff; color: #0056b3; }
        .badge.health-on-track { background: #d1f4e0; color: #0c6b39; }
        .badge.health-at-risk { background: #ffe0e0; color: #c41e3a; }
        
        .detail-section { margin-bottom: 2rem; }
        .detail-section h3 { font-size: 1.1rem; color: #1d1d1f; margin-bottom: 1rem; }
        .detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .detail-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .detail-label { font-size: 0.8rem; color: #6e6e73; text-transform: uppercase; font-weight: 600; }
        .detail-value { font-size: 0.95rem; font-weight: 600; color: #1d1d1f; }
        .resource-list { display: flex; flex-direction: column; gap: 1rem; }
        .resource-item { display: flex; justify-content: space-between; padding: 1rem; background: #fafafa; border-radius: 8px; }
        .resource-item strong { font-size: 0.95rem; color: #1d1d1f; display: block; }
        .resource-item span { font-size: 0.85rem; color: #6e6e73; }
        .empty-message { padding: 2rem; text-align: center; color: #6e6e73; }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
          .pm-grid { grid-template-columns: 1fr; }
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PMOProjectTracker;
