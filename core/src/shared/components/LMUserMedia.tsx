import { AvatarProps } from "../types/models/avatarProps";
const getInitials = (name: string): string => {
  const words = name.split(" ");
  if (words.length === 1) {
    // Only one word, return its initial
    return name[0].toUpperCase();
  } else if (words.length === 2) {
    // Two words, return the initials of both
    const firstInitial = words[0][0];

    return firstInitial.toUpperCase();
  } else {
    // More than two words, return the initials of the first and last names
    const firstInitial = words[0][0];

    return firstInitial.toUpperCase();
  }
};

// Function to handle broken or undefined image URLs
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.display = "none"; // Hide the broken image
};

const getAvatar = ({ imageUrl, name, onError }: AvatarProps): JSX.Element => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onError) {
      onError();
    } else {
      event.currentTarget.style.display = "none";
    }
  };

  return imageUrl ? (
    <img
      src={imageUrl}
      onError={handleImageError}
      alt="avatar"
      loading="lazy"
      lm-feed-component-id={`lm-feed-user-avatar-opqrs-${imageUrl}`}
    />
  ) : (
    <div
      lm-feed-component-id={`lm-feed-post-wrapper-tuvwx-${imageUrl}`}
      className="avatar-initials lm-flex-container lm-justify-content-center lm-align-items-center"
    >
      {name ? getInitials(name) : ""}
    </div>
  );
};

export { getInitials, handleImageError, getAvatar };
