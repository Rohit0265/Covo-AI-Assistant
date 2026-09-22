const fs = require('fs');

let fileContent = fs.readFileSync('/home/my/Desktop/ai/frontend/src/components/sideBar.jsx', 'utf8');

const stateCode = `  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setEditingId(item._id || item.id);
    setEditTitle(item.title || 'New Chat');
  };

  const handleSaveEdit = async (e, id) => {
    e.stopPropagation();
    if (editTitle.trim() === "") {
       setEditingId(null);
       return;
    }
    try {
      await api.post('/api/chat/update-conversation', { id, title: editTitle });
      setConversations(prev => prev.map(c => (c._id === id || c.id === id) ? { ...c, title: editTitle } : c));
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await api.delete(\`/api/chat/delete-conversation/\${id}\`);
      setConversations(prev => prev.filter(c => (c._id !== id && c.id !== id)));
      if (activeConversationId === id && onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error(error);
    }
  };`;

fileContent = fileContent.replace(
  `  const dispatch = useDispatch();\n  const userData = useSelector((state) => state.user.userData);`,
  stateCode
);

const oldButtonContent = `                <button
                  type="button"
                  key={item._id || item.id}
                  onClick={() => onSelectConversation && onSelectConversation(item._id || item.id)}
                  className={\`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all border cursor-pointer \${
                    isSelected
                      ? 'bg-zinc-800/90 border-zinc-700/80 text-white font-medium shadow-sm'
                      : 'bg-transparent border-transparent text-zinc-300 hover:bg-zinc-800/40 hover:text-white'
                  }\`}
                >
                  <div className={\`p-1.5 rounded-lg border transition \${
                    isSelected ? 'bg-zinc-700/80 border-zinc-600 text-white' : 'bg-[#1b1c24] border-zinc-800/80 text-zinc-400 group-hover:text-zinc-200'
                  }\`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="min-w-0 flex-1 truncate">{item.title || 'New Chat'}</span>
                </button>`;

const newButtonContent = `                <button
                  type="button"
                  key={item._id || item.id}
                  onClick={() => onSelectConversation && onSelectConversation(item._id || item.id)}
                  className={\`group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all border cursor-pointer \${
                    isSelected
                      ? 'bg-zinc-800/90 border-zinc-700/80 text-white font-medium shadow-sm'
                      : 'bg-transparent border-transparent text-zinc-300 hover:bg-zinc-800/40 hover:text-white'
                  }\`}
                >
                  <div className={\`p-1.5 rounded-lg border transition \${
                    isSelected ? 'bg-zinc-700/80 border-zinc-600 text-white' : 'bg-[#1b1c24] border-zinc-800/80 text-zinc-400 group-hover:text-zinc-200'
                  }\`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  
                  {editingId === (item._id || item.id) ? (
                    <input
                      autoFocus
                      type="text"
                      className="min-w-0 flex-1 bg-zinc-800 text-white rounded px-2 py-1 outline-none border border-zinc-600"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(e, item._id || item.id);
                        if (e.key === 'Escape') {
                           setEditingId(null);
                           e.stopPropagation();
                        }
                      }}
                      onBlur={(e) => handleSaveEdit(e, item._id || item.id)}
                    />
                  ) : (
                    <span className="min-w-0 flex-1 truncate group-hover:pr-14">{item.title || 'New Chat'}</span>
                  )}
                  
                  {editingId !== (item._id || item.id) && (
                    <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        onClick={(e) => handleEditClick(e, item)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700/60 rounded-md transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <div
                        onClick={(e) => handleDelete(e, item._id || item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700/60 rounded-md transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>`;

fileContent = fileContent.replace(oldButtonContent, newButtonContent);

fs.writeFileSync('/home/my/Desktop/ai/frontend/src/components/sideBar.jsx', fileContent);
