export default function RingSizeChart() {
    const sizeChart = [
      { size: "4", diameter: "14.9mm", circumference: "46.8mm" },
      { size: "5", diameter: "15.7mm", circumference: "49.3mm" },
      { size: "6", diameter: "16.5mm", circumference: "51.8mm" },
      { size: "7", diameter: "17.3mm", circumference: "54.4mm" },
      { size: "8", diameter: "18.1mm", circumference: "56.8mm" },
      { size: "9", diameter: "18.9mm", circumference: "59.3mm" },
      { size: "10", diameter: "19.7mm", circumference: "61.8mm" },
      { size: "11", diameter: "20.5mm", circumference: "64.4mm" },
      { size: "12", diameter: "21.3mm", circumference: "66.8mm" },
    ]
  
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-black mb-4">Ring Size Chart</h2>
            <p className="text-xl text-gray-600">Convert your measurements to find your perfect size</p>
          </div>
  
          <div className="overflow-x-auto animate-fade-in-up">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-600">
                  <th className="px-6 py-4 text-left text-lg font-bold text-black">Ring Size</th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-black">Inner Diameter</th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-black">Circumference</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-lg font-semibold text-blue-600">{row.size}</td>
                    <td className="px-6 py-4 text-gray-700">{row.diameter}</td>
                    <td className="px-6 py-4 text-gray-700">{row.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    )
  }
  