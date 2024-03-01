export default class Age {
    // Constructor
    constructor() {
        if (new.target !== Age) {
            throw new Error('Subclassing not allowed.');
        }

        // Final methods
        Reflect.defineProperty(this, 'get', {
            value: (date, extended, displayMinutes = false) => {
                if (date instanceof Date) {
                    const minutes = Math.floor((new Date() - date) / 1000 / 60);
                    const hours = Math.floor(minutes / 60);

                    if (displayMinutes && minutes < 60) {
                        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
                    } else if (hours === 1) {
                        return extended ? '1 hour ago' : `${hours}h`;
                    } else if (hours < 24) {
                        return extended ? `${hours} hours ago` : `${hours}h`;
                    }

                    const days = Math.floor(hours / 24);

                    if (days === 1) {
                        return extended ? '1 day ago' : `1d`;
                    } else if (days < 7) {
                        return extended ? `${days} days ago` : `${days}d`;
                    }

                    const weeks = Math.floor(days / 7);

                    if (weeks === 1) {
                        return extended ? '1 week ago' : `1w`;
                    } else if (weeks < 7) {
                        return extended ? `${weeks} weeks ago` : `${weeks}w`;
                    }

                    const months = Math.floor(days / 30);

                    if (months === 1) {
                        return extended ? '1 month ago' : `1m`;
                    } else if (months < 12) {
                        return extended ? `${months} months ago` : `${months}m`;
                    }

                    const years = Math.floor(days / 365);

                    if (years === 1) {
                        return extended ? '1 year ago' : `1y`;
                    } else {
                        return extended ? `${years} years ago` : `${years}y`;
                    }
                } else {
                    return '?';
                }
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Object.freeze(this);
    }
}
