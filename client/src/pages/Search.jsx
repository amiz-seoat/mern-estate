import React from "react";
 
 export default function Search() {
   return (
     <div className="flex flex-col md:flex-row gap-8 ">
       <div className=" p-7 border-b-2 border-gray-400 md:border-r-2  md:min-h-screen border-solid  ">
         <form className="flex flex-col gap-8">
           <div className="flex items-center gap-2">
             <label className="whitespace-nowrap font-semibold">
               search Term
             </label>
             <input
               type="text"
               placeholder="search..."
               id="searchTerm"
               className="border rounded-lg bg-white p-3 w-full"
             />
           </div>
           <div className="flex flex-wrap gap-2">
             <label className="font-semibold">Type:</label>
             <div className="flex gap-2">
               <input type="checkbox" id="all" className="w-5" />
               <span>Rent & Sell</span>
             </div>
             <div className="flex gap-2">
               <input type="checkbox" id="rent" className="w-5" />
               <span>Rent </span>
             </div>
             <div className="flex gap-2">
               <input type="checkbox" id="sale" className="w-5" />
               <span>Sale</span>
             </div>
             <div className="flex gap-2">
               <input type="checkbox" id="offer" className="w-5" />
               <span>offer</span>
             </div>
           </div>
           <div className="flex flex-wrap gap-2">
             <label className="font-semibold">Amenities:</label>
             <div className="flex gap-2">
               <input type="checkbox" id="parking" className="w-5" />
               <span>Parking</span>
             </div>
             <div className="flex gap-2">
               <input type="checkbox" id="furnished" className="w-5" />
               <span>Furnished </span>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <label className="font-semibold">sort:</label>
             <select id="sort_order" className="bg-white rounded-lg p-2">
               <option value="">Price high to low</option>
               <option value="">Price low to high</option>
               <option value=""> Latest</option>
               <option value="">Oldest</option>
             </select>
           </div>
           <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 ">
             Search
           </button>
         </form>
       </div>
       <div className="font-semibold text-2xl text-center mt-7 text-slate-700">
         <h1>Listing results</h1>
       </div>
     </div>
   );
 }