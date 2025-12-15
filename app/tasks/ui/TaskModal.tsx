'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';

import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITaskModal {
  open: boolean;
  mode: 'create' | 'edit';
  task: ITaskDTO | null;
  onClose: () => void;
  onSaved: (saved: ITaskDTO) => void;
}

export default function TaskModal({
  open,
  mode,
  task,
  onClose,
  onSaved,
}: ITaskModal) {
  const initial = useMemo(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: (task?.status ?? 'BACKLOG') as TStatus,
      priority: (task?.priority ?? 'MEDIUM') as TPriority,
      tags: (task?.tags ?? []).join(', '),
    }),
    [task],
  );

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [status, setStatus] = useState<TStatus>(initial.status);
  const [priority, setPriority] = useState<TPriority>(initial.priority);
  const [tags, setTags] = useState(initial.tags);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial.title);
    setDescription(initial.description);
    setStatus(initial.status);
    setPriority(initial.priority);
    setTags(initial.tags);
    setError(null);
  }, [open, initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (!payload.title) {
      setError('Title is required.');
      setSaving(false);
      return;
    }

    try {
      const res =
        mode === 'create'
          ? await fetch('/api/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/tasks/${task?._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Request failed');
      }

      const savedTask = (await res.json()) as ITaskDTO;
      onSaved(savedTask);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
      onClose={onClose}
    >
      <Form onSubmit={submit}>
        <DivRow>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </DivRow>

        <DivRow>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DivRow>

        <DivTwoCols>
          <DivRow>
            <Label>Status</Label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TStatus)}
            >
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
          </DivRow>

          <DivRow>
            <Label>Priority</Label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TPriority)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </DivRow>
        </DivTwoCols>

        <DivRow>
          <Label>Tags (comma-separated)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </DivRow>

        {error && <P>{error}</P>}

        <DivActions>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DivActions>
      </Form>
    </Modal>
  );
}

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const DivRow = styled.div`
  display: grid;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: #cbd5e1;
`;

const Input = styled.input`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const Textarea = styled.textarea`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;
  min-height: 110px;
  resize: vertical;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const Select = styled.select`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const DivTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const DivActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'ghost' }>`
  border-radius: 0.5rem;
  border: 1px solid
    ${({ variant }) => (variant === 'primary' ? '#10b981' : '#334155')};
  background: ${({ variant }) =>
    variant === 'primary' ? '#10b981' : '#0f172a'};
  color: ${({ variant }) => (variant === 'primary' ? '#020617' : '#e2e8f0')};
  padding: 0.55rem 0.75rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    filter: brightness(1.07);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const P = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #fca5a5;
`;
