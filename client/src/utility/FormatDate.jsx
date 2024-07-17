const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${month} ${day}${getOrdinal(day)} • ${formattedHours}:${formattedMinutes} ${amOrPm}`;
};

const getOrdinal = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};

export default formatDate;