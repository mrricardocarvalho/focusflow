import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getProjects } from '../services/api';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      if (response.data.length > 0 && !currentProject) {
        setCurrentProject(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [currentProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, currentProject, setCurrentProject, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
