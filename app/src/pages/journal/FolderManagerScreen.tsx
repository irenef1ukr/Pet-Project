import type { JournalFolder } from '../../types';
import './FolderManagerScreen.css';

interface FolderManagerScreenProps {
  folders: JournalFolder[];
  newFolderName: string;
  onBack: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewFolderNameChange: (name: string) => void;
  onAddFolder: () => void;
}

export function FolderManagerScreen({
  folders,
  newFolderName,
  onBack,
  onRename,
  onDelete,
  onNewFolderNameChange,
  onAddFolder,
}: FolderManagerScreenProps) {
  return (
    <div className="journal-screen-center">
      <div className="folder-screen">
        <div className="folder-screen__header">
          <span className="folder-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <div className="folder-screen__title">Manage Folders</div>
        </div>

        <div className="folder-screen__list">
          {folders.map((f) => (
            <div key={f.id} className="folder-row">
              <input
                type="text"
                value={f.name}
                onChange={(e) => onRename(f.id, e.target.value)}
                className="folder-row__name"
              />
              <span className="folder-row__delete" onClick={() => onDelete(f.id)} role="button" tabIndex={0}>
                ×
              </span>
            </div>
          ))}
        </div>

        <div className="folder-screen__add">
          <div className="folder-screen__add-title">Add Folder</div>
          <div className="folder-screen__add-row">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => onNewFolderNameChange(e.target.value)}
              className="folder-row__name"
            />
            <span className="folder-screen__add-btn" onClick={onAddFolder} role="button" tabIndex={0}>
              Add
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
