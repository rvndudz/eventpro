"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Like from './Like'
import Image from "next/image";

const LikeButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  return (
    <div className="flex items-center gap-3">
      <>
        <SignedOut>
          <Link href="/sign-in">
            <div
              className="cursor-pointer rounded-full p-2 shadow-sm transition-all hover:bg-gray-100 bg-white"
              style={{ width: 35, height: 35 }}
            >
              <Image
                src="/icons/heart-outline.svg"
                alt="Not loved"
                width={50}
                height={50}
                style={{ filter: "none" }}
              />
            </div>
          </Link>
        </SignedOut>
        
        <SignedIn>
          <Like event={event} userId={userId} />
        </SignedIn>
      </>
    </div>
  )
}

export default LikeButton