import React from "react"
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs"| "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "danger" | "underfined"
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props 
}) => {
  const baseStyles =
    `font-semibold rounded-lg w-fit whitespace-normal break-words`//focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out border disabled:opacity-60 disabled:cursor-not-allowed`;

    let variantStyles = "";
    switch (variant) {
      case "primary":
        variantStyles = `
          bg-green-600 text-white 
          hover:border-black focus:ring-green-500 
          disabled:bg-green-400 disabled:cursor-not-allowed
        `;
        break;

      case "secondary":
        variantStyles = `
          bg-yellow-600 text-white 
          hover:border-black focus:ring-yellow-500 
          disabled:bg-yellow-400 disabled:cursor-not-allowed
        `;
        break;

      case "danger":
        variantStyles = `
          bg-red-600 text-white 
          hover:border-black focus:ring-red-500 
          disabled:bg-red-400 disabled:cursor-not-allowed
        `;
        break;
      case "underfined":
        variantStyles = `
          bg-gray-600/50 text-grey
          disabled:bg-gray-400/50 disabled:cursor-not-allowed
        `;
        break;
      default:
        variantStyles = `
          bg-gray-600 text-white 
          hover:border-black focus:ring-gray-500 
          disabled:bg-gray-400 disabled:cursor-not-allowed
        `;
    }
    let sizeStyles = "";
    switch (size) {
      case "xs" :
        sizeStyles = `px-2 py-1 text-xs`
        break;
      case "sm" : 
        sizeStyles = `px-3 py-1 text-sm`
        break;
      case "md" :
        sizeStyles = `px-4 py-2 text-base`
        break;
      case "lg" :
        sizeStyles = `px-5 py-3 text-lg`
        break;
      default:
        sizeStyles = `px-4 py-2 text-sm`
    }
    const combinedClassName: string = `
            ${baseStyles}
            ${variantStyles}
            ${sizeStyles}
            ${className || ''}
        `.replace(/\s+/g, ' ').trim();

        return (
            <button type="button" className={combinedClassName} disabled={disabled} {...props}>
                {children}
            </button>
        );
    }

    export default Button;