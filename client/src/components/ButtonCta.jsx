export default function ButtonCta({ children, type = 'button', aria_label = '', title = '', invert = false }) {
    return (
        <button
            className="to-items-500 from-items-700 text-cream-100 after:bg-accent-500 relative z-10 w-fit cursor-pointer rounded-lg bg-linear-to-t p-3 text-center align-middle text-base font-extrabold text-nowrap after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-0 after:w-full after:rounded-lg after:duration-300 after:ease-out hover:after:h-full"
            type={type}
            aria-label={aria_label}
            title={title}
        >
            {children}
        </button>
    );
}
