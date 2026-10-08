import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { ApiError } from '@/lib/api'
import { useSendFriendRequest } from './hooks'

export function AddFriendForm() {
  const [handle, setHandle] = useState('')
  const send = useSendFriendRequest()
  const toast = useToast()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send.mutate(handle, {
      onSuccess: () => {
        toast.show('Friend request sent')
        setHandle('')
      },
    })
  }

  const error =
    send.error instanceof ApiError
      ? send.error.message
      : send.error
        ? 'Couldn’t send that request. Try again.'
        : null

  return (
    <form onSubmit={submit} className="flex items-start gap-2" noValidate>
      <div className="flex-1">
        <Input
          label="Add a friend by handle"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value)
            if (send.error) send.reset()
          }}
          placeholder="@mollyeats"
          autoCapitalize="none"
          autoCorrect="off"
          error={error}
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        className="mt-[1.65rem]"
        loading={send.isPending}
        disabled={!handle.trim()}
      >
        Add
      </Button>
    </form>
  )
}
