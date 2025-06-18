const Loader = () => {
  return (
    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-10">
      <div className="flex space-x-3 p-4 border-b ">
        {[0, 1, 2 , 3].map((i) => (
          <div
            key={i}
            className="w-1 h-5 bg-white rounded-full"
            style={{
              animation: `bounce 1.5s infinite`,
              animationDelay: `${i * .3}s`,
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default Loader
