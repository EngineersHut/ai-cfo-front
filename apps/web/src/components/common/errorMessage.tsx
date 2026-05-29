interface ErrorAlertProps {
    error: string | null;
    onDismiss?: () => void;
}
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
    if (!error) return null;

    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 my-2 rounded flex justify-between items-center">
            <span className="text-sm">{error}</span>
            {onDismiss && (
                <button onClick={onDismiss} className="text-red-500 hover:text-red-700">
                    ×
                </button>
            )}
        </div>
    );
};

interface SuccessAlertProps {
    message: string | null;
    onDismiss?: () => void;
}
export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 my-2 rounded flex justify-between items-center">
            <span className="text-sm font-medium">{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} className="text-emerald-500 hover:text-emerald-700">
                    ×
                </button>
            )}
        </div>
    );
};
