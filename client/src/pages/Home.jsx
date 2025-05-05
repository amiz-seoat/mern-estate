import React, { useEffect } from "react";
 import { useState } from "react";
 import { Link } from "react-router-dom";
 
 import { Swiper, SwiperSlide } from "swiper/react";
 import SwiperCore from "swiper";
 import { Navigation } from "swiper/modules";
 import "swiper/css/bundle";
 import Listing from "./Listing";
 import ListingItem from "../components/ListingItem";
 
 export default function Home() {
  
   SwiperCore.use([Navigation]);
   const [offerListing, setOfferListing] = useState([]);
   const [rentListing, setRentListing] = useState([]);
   const [saleListing, setSaleListing] = useState([]);
   console.log(offerListing);
   useEffect(() => {
     const fetchOfferListing = async () => {
       try {
         const res = await fetch("/api/listing/get?offer=true&limit=4");
         const data = await res.json();
         setOfferListing(data);
         fetchRentListing();
       } catch (err) {
         console.log(err);
       }
     };
     const fetchRentListing = async () => {
       try {
         const res = await fetch("/api/listing/get?type=rent&limit=4");
         const data = await res.json();
         setRentListing(data);
         fetchSaleListing();
       } catch (err) {
         console.log(err);
       }
     };
     const fetchSaleListing = async () => {
       try {
         const res = await fetch("/api/listing/get?type=sale&limit=4");
         const data = await res.json();
         setSaleListing(data);
       } catch (err) {
         console.log(err);
       }
     };
     fetchOfferListing();
   }, []);
   return (
     <div>
       {/* top part */}
       <div className="flex flex-col gap-6 max-w-6xl p-20 px-3 mx-auto">
         <h1 className="text-4xl font-bold  lg:text-5xl text-slate-600">
           Find your dream home{" "}
           <span className="text-slate-400 text-4xl font-bold lg:text-5xl">
             today!
           </span>{" "}
           <br />
           place with ease
         </h1>
         <p className="text-xs sm:text-sm text-gray-400">
           🔍 Search by Location, Price, or Amenities <br />
           🏡 Homes, Apartments, Land & Commercial Properties <br />
           📞 Expert Agents Ready to Help
         </p>
         <Link
           to={"/search"}
           className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
         >
           let's get started...
         </Link>
       </div>
 
       {/*the swiper part  */}
       <Swiper navigation>
         {offerListing &&
           offerListing.length > 0 &&
           offerListing.map((listing) => (
             <SwiperSlide key={listing._id}>
               <img
                 src={listing.imageUrls[0]}
                 alt="lisiting"
                 className="w-full h-[400px] object-cover"
               />
             </SwiperSlide>
           ))}
       </Swiper>
 
       {/* rent and sale part */}
       <div className="max-w-6xl mx-auto flex flex-col my-8 p-3 gap-8">
         {offerListing && offerListing.length > 0 && (
           <div className="flex flex-col gap-2">
             <div className="flex flex-col gap-2">
               <h2 className="text-2xl font-semibold text-slate-600 ">
                 Recent Offer
               </h2>
               <Link
                 className="text-blue-800 hover:underline"
                 to={"/search?offer=true"}
               >
                 {" "}
                 show more
               </Link>
             </div>
             <div className="flex flex-wrap gap-4  items-center">
               {offerListing.map((listing) => (
                 <ListingItem listing={listing} key={listing._id} />
               ))}
             </div>
           </div>
         )}
         {rentListing && rentListing.length > 0 && (
           <div className="flex flex-col gap-2">
             <div className="flex flex-col gap-2">
               <h2 className="text-2xl font-semibold text-slate-600 ">
                 Recent places for Rent
               </h2>
               <Link
                 className="text-blue-800 hover:underline"
                 to={"/search?type=rent"}
               >
                 show more
               </Link>
             </div>
             <div className="flex flex-wrap gap-4  items-center">
               {rentListing.map((listing) => (
                 <ListingItem listing={listing} key={listing._id} />
               ))}
             </div>
           </div>
         )}
         {saleListing && saleListing.length > 0 && (
           <div className="flex flex-col gap-2">
             <div className="flex flex-col gap-2">
               <h2 className="text-2xl font-semibold text-slate-600 ">
                 Recent places for Sale
               </h2>
               <Link
                 className="text-blue-800 hover:underline"
                 to={"/search?type=sale"}
               >
                 {" "}
                 show more
               </Link>
             </div>
             <div className="flex flex-wrap gap-4  items-center">
               {saleListing.map((listing) => (
                 <ListingItem listing={listing} key={listing._id} />
               ))}
             </div>
           </div>
         )}
       </div>
     </div>
   );
 }