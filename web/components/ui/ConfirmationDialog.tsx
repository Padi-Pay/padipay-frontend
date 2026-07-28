"use client"

import { useState } from "react"
import { Modal } from "./Modal"
import { Button } from "./Button"

interface ConfirmationDialogProps {
	isOpen: boolean
	onClose: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	onConfirm: () => Promise<void> | void
}

export function ConfirmationDialog({
	isOpen,
	onClose,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
}: ConfirmationDialogProps) {
	const [isConfirming, setIsConfirming] = useState(false)

	const handleConfirm = async () => {
		setIsConfirming(true)
		try {
			await onConfirm()
			onClose()
		} finally {
			setIsConfirming(false)
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<p className="text-sm text-on-surface-variant mb-6">{message}</p>
			<div className="flex justify-end gap-3">
				<Button
					variant="ghost"
					size="md"
					onClick={onClose}
					disabled={isConfirming}>
					{cancelText}
				</Button>
				<Button
					variant="danger"
					size="md"
					onClick={handleConfirm}
					isLoading={isConfirming}>
					{confirmText}
				</Button>
			</div>
		</Modal>
	)
}
