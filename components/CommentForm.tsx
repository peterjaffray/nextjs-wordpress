import {useMutation} from '@apollo/client'
import {useForm} from 'react-hook-form'
import Comment from '~/components/Comment'
import {CREATE_COMMENT} from '~/lib/mutations'
import {CommentFormFields} from '~/lib/types'

export default function CommentForm({postId}: {postId: number}) {
  const {register, handleSubmit} = useForm()
  const [addComment, {error, data}] = useMutation(CREATE_COMMENT)

  // Form submission handler.
  function onSubmit(form: CommentFormFields) {
    addComment({
      variables: {
        authorName: form?.authorName,
        authorEmail: form?.authorEmail,
        authorUrl: form?.authorUrl,
        comment: form?.comment,
        postID: postId
      }
    })
  }

  // If there's an error, display it.
  if (error) {
    return (
      <>
        {!!error?.graphQLErrors &&
          error?.graphQLErrors?.length >= 1 &&
          error?.graphQLErrors?.map((error, index) => (
            <p key={index} className="font-mono text-red-500">
              {error?.message}
            </p>
          ))}
      </>
    )
  }

  // If the comment was created successfully, show the comment.
  if (data) {
    return (
      <ol>
        {data?.createComment?.success &&
        data?.createComment?.comment != null ? (
          <li>
            <Comment {...data?.createComment?.comment} />
          </li>
        ) : (
          <p>Your comment will be published after moderation.</p>
        )}
      </ol>
    )
  }

  return (
    <form
      className="mt-16 flex flex-col space-y-4"
      name="comment-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register('authorName', {required: true})}
        aria-label="Your first and last name"
        className="field"
        placeholder="Jane Doe"
        required
        type="text"
      />
      <input
        {...register('authorEmail', {required: true})}
        aria-label="Your email address"
        className="field"
        placeholder="email@example.com"
        required
        type="email"
      />
      <input
        {...register('authorUrl')}
        aria-label="Your website address"
        className="field"
        placeholder="https://example.com"
        type="url"
      />
      <textarea
        {...register('comment', {required: true})}
        aria-label="Add your comment"
        className="field"
        placeholder="Add your comment"
        required
      />
      <p className="lg:text-base">
        Basic HTML tags such as <code>&lt;strong&gt;</code>,{' '}
        <code>&lt;em&gt;</code>, <code>&lt;pre&gt;</code>,{' '}
        <code>&lt;code&gt;</code>, are allowed. Press enter twice to create a
        new paragraph.
      </p>
      <button
        className="bg-zinc-400 px-2 py-2 dark:bg-zinc-700"
        aria-label="Click to submit your comment"
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}
