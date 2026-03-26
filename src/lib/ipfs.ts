/**
 * Upload a PAN verification file to IPFS via Pinata SDK
 * Attaches metadata so the Admin can identify the user.
 */
export const uploadIdentityToIpfs = async (address: string, file: File): Promise<string> => {
  try {
    const jwt = import.meta.env.VITE_PINATA_JWT;
    if (!jwt) throw new Error("VITE_PINATA_JWT is not set in environment");
    
    // We use standard fetch for pinning file with metadata since it's most reliable across Pinata SDK versions
    const formData = new FormData();
    formData.append('file', file);
    
    const pinataMetadata = JSON.stringify({
      name: `PAN_Card_${address}`,
      keyvalues: {
        address: address,
        docType: 'PAN'
      }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    formData.append('pinataOptions', pinataOptions);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      body: formData,
    });

    const result = await res.json();
    if (result.error) throw new Error(result.error.details || result.error);
    return result.IpfsHash;
  } catch (err: any) {
    throw new Error('IPFS Upload failed. ' + err.message);
  }
};

/**
 * Admin only: Fetch all pinned files from Pinata to see all user data.
 */
export const getAllIdentities = async (): Promise<any[]> => {
  try {
    const jwt = import.meta.env.VITE_PINATA_JWT;
    if (!jwt) throw new Error("VITE_PINATA_JWT is not set in environment");

    const res = await fetch('https://api.pinata.cloud/data/pinList?status=pinned&includesCount=false', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    // Filter to only return PAN cards
    return data.rows.filter((item: any) => item.metadata?.keyvalues?.docType === 'PAN');
  } catch (err: any) {
    throw new Error('Failed to fetch user identities: ' + err.message);
  }
};

export const getIpfsUrl = (cid: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};
