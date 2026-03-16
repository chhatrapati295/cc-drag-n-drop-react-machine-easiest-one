import { useState } from "react";

const DragAndDrop = () => {
  const [dragAreaActive, setDragAreaActive] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragEnter = () => {
    setDragAreaActive(true);
  };

  const handleDragLeave = () => {
    setDragAreaActive(false);
  };

  // IMPORTANT: without preventDefault() dropping files will NOT work
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragAreaActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragAreaActive(false);

    // FileList is not an array → convert it
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Prevent duplicate files
    const uniqueFiles = droppedFiles.filter(
      (file) => !selectedFiles.some((f) => f.name === file.name)
    );

    setSelectedFiles((prev) => [...uniqueFiles, ...prev]);
  };

  const handleDeleteFile = (fileName: string) => {
    const filteredData = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(filteredData);
  };

  const handleSaveData = () => {
    console.log("final data : ", selectedFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center font-semibold">
        Drag & Drop {selectedFiles.length}
      </h1>

      <div
        className={`border-2 border-dashed ${
          dragAreaActive ? "border-blue-400" : ""
        } p-4 rounded-md min-h-20 flex flex-col gap-2 items-center justify-center`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Drag files here
      </div>

      <ul className="flex flex-col gap-2">
        {selectedFiles.map((file) => (
          <li
            key={file.name}
            className="flex justify-between gap-2 items-center border rounded-md p-2 text-sm"
          >
            {/* create preview URL */}
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              onLoad={(e) =>
                // IMPORTANT: revoke URL to avoid memory leak
                URL.revokeObjectURL((e.target as HTMLImageElement).src)
              }
              className="h-6 w-6 rounded-md"
            />

            <p className="text-xs flex gap-2 items-center">
              <span className="break-words">{file.name}</span>
              <span className="text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2) + "MB"}
              </span>

              <button
                onClick={() => handleDeleteFile(file.name)}
                className="p-2 text-xs bg-red-300 rounded-md"
              >
                Delete
              </button>
            </p>
          </li>
        ))}
      </ul>

      <button onClick={handleSaveData} className="p-2 text-xs bg-blue-300">
        Save
      </button>
    </div>
  );
};

export default DragAndDrop;
