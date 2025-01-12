"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Like from './Like'

const LikeButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  return (
    <div className="flex items-center gap-3">
      <>
        <SignedOut>
          <Button asChild className="button rounded-full" size="lg">
            <Link href="/sign-in">
              LIKE
            </Link>
          </Button>
        </SignedOut>

        <SignedIn>
          <Like event={event} userId={userId} />
        </SignedIn>
      </>
    </div>
  )
}

export default LikeButton