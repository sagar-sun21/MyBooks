import React from 'react';
import Modal from './Modal';
import DangerButton from './DangerButton';
import SecondaryButton from './SecondaryButton';

export default function ConfirmationModal({ 
    show = false, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    processing = false 
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {title}
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {cancelText}
                    </SecondaryButton>

                    <DangerButton onClick={onConfirm} disabled={processing}>
                        {processing ? 'Processing...' : confirmText}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
