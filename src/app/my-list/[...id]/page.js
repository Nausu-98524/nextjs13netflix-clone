"use client";

import { GlobalContext } from "@/context";
import { getAllFavorites } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import CircleLoader from "@/components/circle-loader";
import MediaItem from "@/components/media-item";
import UnauthPage from "@/components/unauth-page";
import ManageAccounts from "@/components/manage-accounts";

const MyList = () => {
  const {
    favorites,
    setFavorites,
    loggedInAccount,
    pageLoader,
    setPageLoader,
  } = useContext(GlobalContext);

  const { data: session } = useSession();

  useEffect(() => {
    async function extractFavorites() {
      const data = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );
      console.log(data);

      if(data){
        setFavorites(data.map(item => ({
          ...item, addedToFavorites : true
        })))
        
        setPageLoader(false)
      }
    }
    extractFavorites();
  }, [loggedInAccount]);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if(pageLoader) return <CircleLoader />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Navbar />

      <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
        <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
          My List
        </h2>
        <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
          {favorites && favorites.length
            ? favorites.map((searchItem) => (
                <MediaItem
                  key={searchItem.id}
                  media={searchItem}
                  listView={true}
                />
              ))
            : "No Favorites Added"}
        </div>
      </div>



    </motion.div>
  );
};

export default MyList;
