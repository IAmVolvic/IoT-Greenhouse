export const Watermark = () => {
   

    return (
        <div className="flex flex-row items-center justify-center gap-5 absolute z-20 right-0 bottom-0 text-light200 mb-5 mr-5">
           <a href="https://www.easv.dk"><img src="https://www.easv.dk/app/uploads/favicon/icon-128x128.png" alt="Watermark" className="h-16 aspect-square" /></a>

           <a href="https://github.com/IAmVolvic/IoT-Greenhouse" className="bg-dark100 rounded-full p-1">
                <img src="https://img.icons8.com/ios11/512/FFFFFF/github.png" alt="Watermark" className="h-10 aspect-square" />
           </a>
        </div>
    );
};