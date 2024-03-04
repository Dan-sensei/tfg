"use client"
export default function CalculateScores() {
    function calculateScores() {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/calculate-scores`, {
            cache: "no-store",
        });
    }
    return (
        <button className="bg-blue-400" onClick={calculateScores}>Calculate Scores</button>
    )
}