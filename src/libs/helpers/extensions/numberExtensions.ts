interface Number {
  /**
   * Convert time in seconds to a readable string.
   */
  toReadableTimeFromSeconds(): string;
  /**
   * Convert bytes to readable file size string.
   */
  toReadableFileSize(): string;
  /**
   * Convert signed decimal to hex twos complement.
   */
  toHexTwosComplement(): string;
}

Number.prototype.toReadableTimeFromSeconds = function(this: number): string {
  // Get days, hours, minutes and seconds from total seconds
  const d = Math.floor(this / (3600 * 24));
  const h = Math.floor((this % (3600 * 24)) / 3600);
  const m = Math.floor((this % 3600) / 60);
  const s = Math.floor(this % 60);

  // Turn into readable format
  const dDisplay = d > 0 ? (d < 10 ? "0" + d : d) + ":" : "";
  const hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + ":" : "";
  const mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + ":" : "00:";
  const sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

  // Return readable format
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

Number.prototype.toReadableFileSize = function(this: number): string {
  // If file size is 0 then return "0 B", otherwise math below will return `undefined`
  if (this == 0) return "0 B";

  const i = Math.floor(Math.log(this) / Math.log(1024));

  // Tell me who else supports yottabytes
  return Math.round(this / Math.pow(1024, i)) * 1 + " " + ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
};

Number.prototype.toHexTwosComplement = function(this: number, size: number = 8): string {
  if (this >= 0) {
    let hex = this.toString(16);

    while (hex.length % size != 0) {
      hex = "" + 0 + hex;
    }

    return hex;
  } else {
    let hex = Math.abs(this).toString(16);
    while (hex.length % size != 0) {
      hex = "" + 0 + hex;
    }

    let output = "";
    for (let i = 0; i < hex.length; i++) {
      output += (0x0f - parseInt(hex[i], 16)).toString(16);
    }

    return (0x01 + parseInt(output, 16)).toString(16);
  }
};
