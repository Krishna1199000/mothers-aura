interface KyrahDiamond {
  StockID: string;
  "Certificate No": string;
  Shape: string;
  Size: number;
  Color: string;
  Clarity: string;
  Cut: string;
  Polish: string;
  Sym: string;
  Fluoro: string;
  Lab: string;
  RapPrice: number;
  RapAmount: number;
  Discount: number;
  PricePerCarat: number;
  FinalAmount: number;
  Measurement: string;
  Length: number;
  Width: number;
  Height: number;
  Depth: number;
  Table: number;
  Ratio: number;
  Status: string;
  Comment: string;
  "Video URL": string;
  "Image URL": string;
  "Cert URL": string;
  Girdle: string;
  Culet: string;
  CAngle: number;
  CHeight: string;
  PAngle: number;
  PDepth: number;
  "Fancy Intensity": string;
  "Fancy Overtone": string;
  "Fancy Color": string;
  Location: string;
  Inscription: string;
}

interface KyrahResponse {
  success: boolean;
  message: string;
  data: KyrahDiamond[];
}

export async function fetchKyrahDiamonds() {
  try {
    const username = process.env.KYRAH_API_USERNAME;
    const password = process.env.KYRAH_API_PASSWORD;
    
    console.log('API Credentials Check:');
    console.log('Username:', username ? `${username.substring(0, 3)}***` : 'NOT SET');
    console.log('Password:', password ? '***SET***' : 'NOT SET');
    
    if (!username || !password) {
      throw new Error('Kyrah API credentials not configured. Please set KYRAH_API_USERNAME and KYRAH_API_PASSWORD environment variables.');
    }

    const formData = new URLSearchParams();
    formData.append('USERNAME', username);
    formData.append('PASSWORD', password);

    console.log('Making API request to Kyrah...');
    const response = await fetch('https://kyrahapi.azurewebsites.net/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: KyrahResponse = await response.json();

    // Debug: Log the actual response structure
    console.log('Kyrah API Response:', JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    // Check if data.data exists and is an array
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('No diamond data found in API response:', data);
      return [];
    }

    // Transform the data to match our application's format
    return data.data.map(diamond => ({
      id: diamond.StockID,
      stockId: diamond.StockID,
      shape: diamond.Shape,
      carat: diamond.Size,
      color: diamond.Color,
      clarity: diamond.Clarity,
      cut: diamond.Cut,
      polish: diamond.Polish,
      symmetry: diamond.Sym,
      lab: diamond.Lab,
      status: diamond.Status,
      pricePerCarat: diamond.PricePerCarat,
      amount: diamond.FinalAmount,
      imageUrl: diamond["Image URL"],
      videoUrl: diamond["Video URL"],
      certificateUrl: diamond["Cert URL"],
      fluorescence: diamond.Fluoro,
      source: 'kyrah',
      measurements: {
        length: diamond.Length,
        width: diamond.Width,
        height: diamond.Height,
        depth: diamond.Depth,
        table: diamond.Table,
        ratio: diamond.Ratio,
      },
      additional: {
        girdle: diamond.Girdle,
        culet: diamond.Culet,
        crownAngle: diamond.CAngle,
        crownHeight: diamond.CHeight,
        pavilionAngle: diamond.PAngle,
        pavilionDepth: diamond.PDepth,
        fancyIntensity: diamond["Fancy Intensity"],
        fancyOvertone: diamond["Fancy Overtone"],
        fancyColor: diamond["Fancy Color"],
        location: diamond.Location,
        inscription: diamond.Inscription,
      }
    }));
  } catch (error) {
    console.error('Error fetching Kyrah diamonds:', error);
    throw error;
  }
}
