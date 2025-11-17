export default function BannerDashboard({ banner, children }) {
    return (
        <div className="text-cream-100 relative h-60 w-full overflow-hidden rounded-4xl before:absolute before:top-0 before:left-0 before:h-full before:w-full before:bg-black/30 md:h-80 2xl:h-96">
            <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 py-4 pr-4 md:left-8 lg:left-16">
                {children}
            </div>
            <img className="h-full w-full object-cover object-center" src={banner} />
        </div>
    );
}
