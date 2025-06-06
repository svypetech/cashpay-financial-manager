import SemiCircleGauge from "./semi";
export default function Check(){
    return(
        <>
            <main className="px-6 sm:px-10 py-6">
                <div className="flex flex-col items-center justify-center h-screen">
                    <SemiCircleGauge />
                </div>
            </main>
        </>
    )
}