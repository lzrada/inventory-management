const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
      <div className="flex justify-center items-center min-h-screen">
        <div className=" flex justify-center items-center bg-transparent bg-opacity-60 loading"></div>
      </div>
    </div>
  );
};
export default Loading;
