Issue #2 — feat: Shared UI Components & Design System
Description
To ensure visual consistency and developer velocity, we must abstract repeating UI patterns into a shared component library. The dashboard requires consistent indicators for loading, errors, and empty states. Developers should never need to write custom CSS for a button or a modal.

This epic focuses on building the foundational building blocks required for state indication, interaction abstractions (modals), and domain-specific components (wallet badges). Every component must be accessible, responsive, and adhere strictly to the vibrant, glassmorphic design system established in Phase 1. By completing this epic, you provide the exact tools needed by the rest of the engineering team to rapidly assemble complex pages.

Requirements & Context
web/components/ui/Button.tsx

web/components/ui/Spinner.tsx & web/components/ui/SkeletonLoader.tsx

web/components/ui/Modal.tsx & web/components/ui/ConfirmationDialog.tsx

web/components/ui/Toast.tsx & web/store/toastStore.ts

web/components/domain/WalletBadge.tsx

web/components/domain/EscrowBadge.tsx
Tasks:
Part A — Foundational UI Atoms & State Indicators

Enhance Button.tsx to support variant (primary, secondary, danger, ghost), size (sm, md, lg), and an isLoading boolean prop that disables the button and replaces the text with a Spinner.
Build a suite of highly polished global loading spinners (Spinner.tsx) and skeleton loaders (SkeletonLoader.tsx) with animated shimmering effects.
Build reusable empty state illustrations/components (EmptyState.tsx) that accept a title, description, icon, and an optional call-to-action button.
Build a global Toast notification system. Implement toastStore.ts to manage an array of active toasts. Create ToastContainer.tsx to render them. Toasts must auto-dismiss after 5000ms and support success, error, and info variants. Limit the maximum number of visible toasts to 3 to prevent screen clutter.
Part B — Interaction Abstractions
Build a highly reusable Modal.tsx abstraction that accepts isOpen, onClose, and title. It must handle its own open/close animation states, apply overflow: hidden to the document body when open, close when the overlay backdrop is clicked, and close when the Escape key is pressed. Focus must be trapped inside the modal while open.
Build a reusable ConfirmationDialog.tsx wrapping Modal.tsx, explicitly designed for destructive or financial actions. It should accept title, message, confirmText, cancelText, and an asynchronous onConfirm callback that triggers a loading state on the confirm button until the promise resolves.
Part C — Domain-Specific Components
Build a WalletBadge.tsx component that takes a Stellar public key (56 characters, starts with G). It must truncate the display (e.g., GABCD...WXYZ) but copy the full address to the clipboard when clicked, showing a temporary "Copied!" tooltip.
Build an EscrowBadge.tsx that visually distinguishes escrow statuses using distinct color tokens with a soft background pill style: Pending (Yellow/Amber), Locked (Blue/Indigo), Resolved (Green/Emerald).
Acceptance Criteria

All components are fully responsive and accessible (ARIA labels, keyboard navigation, role="dialog" for modals).

Components accept flexible className overriding via clsx and tailwind-merge (twMerge) for customization without style conflicts.

Modals correctly trap focus and prevent background scrolling when open.

Truncated wallet addresses copy the full underlying address to the clipboard successfully.

Buttons visually indicate loading states and prevent double-clicks when isLoading is true.
Out of Scope
Assembling the final application pages (e.g., the Wallet Dashboard).
Complex form inputs like currency formatters (handled in Epic Forms & Validation Platform #3).
Suggested Execution
git checkout -b epic/shared-ui-components
Suggested Commit Message
epic: build shared design system components, modals, and wallet badges
Testing Notes
Render all variants of the EscrowBadge in a temporary test page and verify colors contrast properly against both light and dark backgrounds.
Test Modal keyboard accessibility by opening it and pressing Tab repeatedly; ensure focus loops within the modal and does not escape to the background document.
Test the Toast notification system by triggering 5 toasts rapidly; ensure only 3 are visible at a time and the oldest are correctly removed.
References
Headless UI / Radix UI patterns for accessible modals and focus trapping.
Tailwind Merge (twMerge) utilities for dynamic class merging.

Definition of Done

Ready for review.