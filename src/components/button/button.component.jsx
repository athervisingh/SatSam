const Button = ({label , disable}) => {
  return (
    <div>
      <button
        type="button"
        className="text-white min-w-28 bg-[#212529] ring-teal-500 hover:bg-[#0d9488] font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:outline-none focus:ring-4 focus:ring-[#0d9488] focus:ring-offset-2 focus:ring-offset-[#212529] border-2 border-transparent"
    
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
