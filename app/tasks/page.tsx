'use client';

import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';

import type { TTaskDocument } from '@/lib/models/Task';

type TStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
type TPriority = 'LOW' | 'MEDIUM' | 'HIGH';

const statusLabels = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<TTaskDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TPriority | 'ALL'>(
    'ALL',
  );
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      const text = `${task.title} ${task.descrition ?? ''}`.toLocaleLowerCase();
      if (search && !text.includes(search.toLocaleLowerCase())) {
        return false;
      }

      return true;
    });
  }, [statusFilter, priorityFilter, search, tasks]);

  const groupedByStatus = useMemo(() => {
    const groups: Record<TStatus, TTaskDocument[]> = {
      BACKLOG: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (const task of filteredTasks) {
      groups[task.status].push(task);
    }

    return groups;
  }, [filteredTasks]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Main>
      <Header>
        <div>
          <H1>DevTasks Board</H1>
          <P>
            Simple full-stack task board built with Next.js, MongoDB and
            TypeScript.
          </P>
        </div>

        <Button onClick={() => alert('TODO: open create task modal/form')}>
          + New Task
        </Button>
      </Header>

      <SectionFilter>
        <DivFilter>
          <SelectFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TStatus)}
          >
            <option value="ALL">All Statuses</option>
            <option value="BACKLOG">Backlog</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </SelectFilter>

          <SelectFilter
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TPriority)}
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="Medium">Medium</option>
            <option value="HIGH">High</option>
          </SelectFilter>
        </DivFilter>

        <InputFilter
          placeholder="Search by title or descrition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SectionFilter>

      {loading ? (
        <P>Loading tasks...</P>
      ) : (
        <SectionTasks>
          {(['BACKLOG', 'IN_PROGRESS', 'DONE'] as TStatus[]).map((status) => (
            <DivTasks key={status}>
              <h2>
                {statusLabels[status]} ({groupedByStatus[status].length})
              </h2>

              <div>
                {groupedByStatus[status].map((task) => (
                  <Article key={task._id}>
                    <HeaderArticle>
                      <h3>{task.title}</h3>
                      <span>{priorityLabels[task.priority]}</span>
                    </HeaderArticle>

                    {task.descrition && <p>{task.descrition}</p>}

                    {task.tags && task.tags.length > 0 && (
                      <DivTags>
                        {task.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </DivTags>
                    )}
                  </Article>
                ))}

                {groupedByStatus[status].length === 0 && (
                  <PStatus>No tasks in this column.</PStatus>
                )}
              </div>
            </DivTasks>
          ))}
        </SectionTasks>
      )}
    </Main>
  );
};

export default TasksPage;

const Main = styled.main`
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #020617;
  color: #f1f5f9;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
`;

const P = styled.p`
  color: #94a3b8;
`;

const Button = styled.button`
  border-radius: 0.25rem;
  background-color: #10b981;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #020617;
  align-self: flex-start;

  &:hover {
    background-color: #34d399;
  }
`;

const SectionFilter = styled.section`
  margin-bottom: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const DivFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SelectFilter = styled.select`
  border-radius: 0.25rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
`;

const InputFilter = styled.input`
  width: 100%;
  max-width: 20rem;
  border-radius: 0.25rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
`;

const SectionTasks = styled.section`
  display: grid;
  gap: 1rem;

  & > div {
    border-radius: 0.75rem;
    border: 1px solid #1e293b;
    background-color: rgba(15, 23, 42, 0.6);
    padding: 0.75rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DivTasks = styled.div`
  & > h2 {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    color: #cbd5e1;
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Article = styled.article`
  border-radius: 0.5rem;
  border: 1px solid #1e293b;
  background-color: #0f172a;
  padding: 0.75rem;
  font-size: 0.875rem;

  &:hover {
    border-color: rgba(16, 185, 129, 0.6);
  }
`;

const HeaderArticle = styled.header`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;

  & > h3 {
    font-weight: 500;
  }

  & > span {
    border-radius: 100%;
    background-color: #1e293b;
    padding: 0.125rem 0.5rem;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: #cbd5e1;
  }

  & > p {
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: #94a3b8;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
`;

const DivTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  & > span {
    border-radius: 100%;
    background-color: #1e293b;
    padding: 0.125rem 0.5rem;
    font-size: 10px;
    color: #cbd5e1;
  }
`;

const PStatus = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  color: #64748b;
`;
