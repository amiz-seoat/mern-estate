import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {
    SwiperCore.use([Navigation])
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const params = useParams()
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false)
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
    
        fetchListing();
    }, [params.listingId]);
   
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error &&  console.log(error)}
            {listing && !loading && !error && (
                <>
                 <Swiper navigation>
                    {listing.imageUrls.map(
                        url => (
                            <SwiperSlide key={url}>
                                <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`}}>

                                </div>

                            </SwiperSlide>
                        )
                    )}
                 </Swiper>
                </>
            )}
      </main>
  )
}
