export const formatDate = (date: string): string => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const truncateLongText = (text: string): string =>
  text.length > 12 ? `${text.substring(0, 6)}…${text.substring(text.length - 6)}` : text;

export const formatBlockNumber = (block_number: number): string =>
  block_number.toLocaleString();

export const copyToClipboard = async (data: unknown): Promise<boolean> => {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    
    // Use Clipboard API if available (modern browsers)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers and mobile devices
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Ensure mobile device keyboard doesn't appear
    textArea.setAttribute('readonly', '');
    
    // Select the text
    textArea.focus();
    textArea.select();
    
    // Execute the copy command
    const successful = document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
