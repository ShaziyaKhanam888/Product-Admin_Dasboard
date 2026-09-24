"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
}) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-200">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-gray-900">"{productTitle}"</strong>? This
          action cannot be undone.
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}
