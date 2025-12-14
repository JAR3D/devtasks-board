import styled from 'styled-components';

import type { TStatus, TPriority } from './TasksClient';
import type { TTaskDocument } from '@/lib/models/Task';

interface ITasks {
  statusLabels: Record<TStatus, string>;
  groupedByStatus: Record<TStatus, TTaskDocument[]>;
  priorityLabels: Record<TPriority, string>;
}

const Tasks = ({ statusLabels, groupedByStatus, priorityLabels }: ITasks) => {
  return (
    <Section>
      {(['BACKLOG', 'IN_PROGRESS', 'DONE'] as TStatus[]).map((status) => (
        <div key={status}>
          <H2>
            {statusLabels[status]} ({groupedByStatus[status].length})
          </H2>

          <Div>
            {groupedByStatus[status].map((task) => (
              <Article key={task._id}>
                <Header>
                  <H3>{task.title}</H3>
                  <Span>{priorityLabels[task.priority]}</Span>
                </Header>

                {task.description && (
                  <PDescription>{task.description}</PDescription>
                )}

                {task.tags && task.tags.length > 0 && (
                  <DivTags>
                    {task.tags.map((tag) => (
                      <SpanTag key={tag}>#{tag}</SpanTag>
                    ))}
                  </DivTags>
                )}
              </Article>
            ))}

            {groupedByStatus[status].length === 0 && (
              <PStatus>No tasks in this column.</PStatus>
            )}
          </Div>
        </div>
      ))}
    </Section>
  );
};

export default Tasks;

const Section = styled.section`
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

const H2 = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #cbd5e1;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const Header = styled.header`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const H3 = styled.h3`
  font-weight: 500;
`;

const Span = styled.span`
  border-radius: 100%;
  background-color: #1e293b;
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #cbd5e1;
`;

const PDescription = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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

const SpanTag = styled.span`
  border-radius: 100%;
  background-color: #1e293b;
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  color: #cbd5e1;
`;

const PStatus = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  color: #64748b;
`;
