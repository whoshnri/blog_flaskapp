const Loader = () => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-base flex justify-center items-center z-10">
      <div className="flex space-x-3 p-4 border-b ">
        {[0, 1, 2 , 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 bg-${i == 0 ? "white" : i == 1 ? "blue-500" : i ==  2 ? "green-600" : i == 3 ? "white" : ''} rounded-full`}
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
