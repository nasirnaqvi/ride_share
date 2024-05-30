

interface ProfileProps {
  setSignedIn: () => void
}

export default function Profile(props: ProfileProps) {
  return (
    <div>
      <h1>This is the profile page!</h1>
      <button
        onClick={props.setSignedIn}
      >
        Logout
      </button>
    </div>
  )
}