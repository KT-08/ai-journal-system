import { useState, useEffect } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("create");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const handleCreate = async () => {
    const response = await fetch("http://127.0.0.1:8000/create-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: content }),
    });
    const data = await response.json();
    setCreateMessage("Entry created! Emotion detected: " + data.emotion);
    setTitle("");
    setContent("");
  };

  const fetchEntries = async () => {
    const response = await fetch("http://127.0.0.1:8000/entries");
    const data = await response.json();
    setEntries(data.entries);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async () => {
    const response = await fetch(`http://127.0.0.1:8000/delete-entry/${deleteTitle}`, {
      method: "DELETE",
    });
    const data = await response.json();
    setDeleteMessage(data.message);
    setDeleteTitle("");
    fetchEntries();
  };

  const handleUpdate = async () => {
    const response = await fetch(`http://127.0.0.1:8000/update-entry/${updateTitle}?new_content=${updateContent}`, {
      method: "PUT",
    });
    const data = await response.json();
    setUpdateMessage(data.message + " New emotion: " + data.new_emotion);
    setUpdateTitle("");
    setUpdateContent("");
    fetchEntries();
  };

  return (
    <div className="flex min-h-screen bg-black">

      {/* SIDEBAR */}
      <nav className="justify-between items-center bg-[#0a0a0a] border-r-4 border-[#39FF14] p-4 w-1/5">
        <h2 className="text-[#39ff14] text-2xl font-bold font-['Courier_New',monospace] [text-shadow:0_0_4px_#39ff14] border-b border-[#39ff14] mb-5">AI JOURNAL</h2>
        <div className=" flex flex-col ">
          <p onClick={() => setActiveSection("create")} className={`font-['Courier_New',monospace] text-[#39ff14] mb-2 p-2 cursor-pointer ${activeSection === 'create' ? "[text-shadow:0_0_4px_#39ff14] font-semibold border-l rounded-sm border-[#39ff14]" : 'text-[#39ff14] '} `}> Create Entry</p>
          <p onClick={() => setActiveSection("view")} className={`font-['Courier_New',monospace] text-[#39ff14] mb-2 p-2 cursor-pointer ${activeSection === 'view' ? "[text-shadow:0_0_4px_#39ff14] font-semibold border-l rounded-sm border-[#39ff14]" : 'text-[#39ff14] '} `}> View Entries</p>
          <p onClick={() => setActiveSection("update")} className={`font-['Courier_New',monospace] text-[#39ff14] mb-2 p-2 cursor-pointer ${activeSection === 'update' ? "[text-shadow:0_0_4px_#39ff14] font-semibold border-l rounded-sm border-[#39ff14]" : 'text-[#39ff14] '} `}> Update Entry</p>
          <p onClick={() => setActiveSection("delete")} className={`font-['Courier_New',monospace] text-[#39ff14] mb-2 p-2 cursor-pointer ${activeSection === 'delete' ? "[text-shadow:0_0_4px_#39ff14] font-semibold border-l rounded-sm border-[#39ff14]" : 'text-[#39ff14] '} `}> Delete Entry</p>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex justify-center items-center m-auto p-3">
        {/* <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-[#39ff14] flex items-center justify-center text-[#39ff14] font-['Courier_New',monospace] text-sm [text-shadow:0_0_4px_#39ff14]">
          KT
        </div> */}
        <div className="absolute text-[#39ff14] top-4 right-4 p-2 rounded-4xl border font-['Courier_New',monospace]">KT</div>
        {activeSection === "create" && (
          <div className="flex flex-col items-center bg-[#0a0a0a] h-fit w-2xl p-10 border border-[#747272] rounded-3xl">
            <h2 className="font-['Courier_New',monospace] text-[#39ff14] [text-shadow:0_0_4px_#39ff14] border-b border-[#39ff14] font-semibold text-4xl mb-5">Create Entry</h2>

            <input className="bg-black text-white w-full border rounded-2xl border-[#39ff14] p-5 mb-5"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows={4}
              className="bg-black text-white w-full border rounded-2xl border-[#39ff14] p-5 mb-5"
              placeholder="Write your journal..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button className="text-white w-3/5 border rounded-2xl border-[#39ff14] p-3 bg-[#2cfc0722] hover:cursor-pointer hover:bg-[#2cfc0762]" onClick={handleCreate}>Submit</button>
            {createMessage && <p className="text-[#39ff14]">{createMessage}</p>}
          </div>
        )}

        {activeSection === "view" && (
          <div className="flex flex-col items-center bg-[#0a0a0a] h-fit w-3xl p-10 border border-[#747272] rounded-3xl">
            <h2 className="font-['Courier_New',monospace] text-[#39ff14] [text-shadow:0_0_4px_#39ff14] border-b border-[#39ff14] font-semibold text-4xl mb-5">View Entries</h2>
            <button className="text-white w-2/5 border rounded-2xl border-[#39ff14] p-3 mb-10 bg-[#2cfc0722] hover:cursor-pointer hover:bg-[#2cfc0762]" onClick={fetchEntries}>Refresh</button>

            {entries.length === 0 && <p className="text-[#39ff14]">No entries found.</p>}
            {entries.map((entry, index) => (
              <div key={index} className="border bg-black border-gray-100 rounded-2xl mb-15 p-5 w-3/5 h-fit">
                <h3 className="text-[#39ff14] border-b border-[#39ff14] text-2xl font-semibold text-center mb-4">{entry.title}</h3>
                <p className="text-white mb-5">{entry.content}</p>
                <p className="text-[#39ff14]"><strong>Emotion:</strong> {entry.emotion}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "update" && (
          <div className="flex flex-col items-center bg-[#0a0a0a] h-fit w-2xl p-10 border border-[#747272] rounded-3xl">
            <h2 className="font-['Courier_New',monospace] text-[#39ff14] [text-shadow:0_0_4px_#39ff14] border-b border-[#39ff14] font-semibold text-4xl mb-5">Update Entry</h2>
            <input
              type="text" className="bg-black text-white w-full border rounded-2xl border-[#39ff14] p-5 mb-5"
              placeholder="Enter title to update"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />

            <textarea className="bg-black text-white w-full border rounded-2xl border-[#39ff14] p-5 mb-5"
              rows={4}
              placeholder="Enter new content..."
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
            />

            <button className="text-white w-3/5 border rounded-2xl border-[#39ff14] p-3 bg-[#2cfc0722] hover:cursor-pointer hover:bg-[#2cfc0762]" onClick={handleUpdate}>Update</button>
            {updateMessage && <p className="text-[#39ff14]">{updateMessage}</p>}
          </div>
        )}

        {activeSection === "delete" && (
          <div className="flex flex-col items-center bg-[#0a0a0a] h-fit w-2xl p-10 border border-[#747272] rounded-3xl">
            <h2 className="font-['Courier_New',monospace] text-[#39ff14] [text-shadow:0_0_4px_#39ff14] border-b border-[#39ff14] font-semibold text-4xl mb-5">Delete Entry</h2>
            <input
              type="text" className="bg-black text-white w-full border rounded-2xl border-[#39ff14] p-5 mb-5"
              placeholder="Enter title to delete"
              value={deleteTitle}
              onChange={(e) => setDeleteTitle(e.target.value)}
            />

            <button className="text-white w-3/5 border rounded-2xl border-[#39ff14] p-3 bg-[#2cfc0722] hover:cursor-pointer hover:bg-[#2cfc0762]" onClick={handleDelete}>Delete</button>
            {deleteMessage && <p className="text-[#39ff14]" >{deleteMessage}</p>}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;