import React from 'react';
import { Edit2, Trash2, BarChart2 } from 'lucide-react';

const FeedbackTable = ({ feedbacks, currentPage, entriesPerPage, onDelete, onActiveToggle, onEdit }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-100">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Active</th>
            <th className="px-6 py-3">Created Date</th>
            <th className="px-6 py-3">Modified Date</th>
            <th className="px-6 py-3">Link</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr 
              key={feedback._id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                {(currentPage - 1) * entriesPerPage + index + 1}
              </td>
              <td className="px-6 py-4 font-medium">
                <div className="flex items-center gap-2">
                  {feedback.name}
                  {feedback.isDefault && (
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">{feedback.title}</td>
              <td className="px-6 py-4">{feedback.type}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={feedback.active}
                    onChange={() => onActiveToggle(feedback._id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </td>
              <td className="px-6 py-4">{new Date(feedback.createdDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                {feedback.modifiedDate ? new Date(feedback.modifiedDate).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4">
                <a 
                  href={`https://yourapp.com/forms/${feedback.formLink}`}
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {feedback.formLink}
                </a>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(feedback)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(feedback._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <BarChart2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;