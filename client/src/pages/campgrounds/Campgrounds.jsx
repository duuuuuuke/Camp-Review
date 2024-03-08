import { useLoaderData, Link, Await, defer } from "react-router-dom";

import "./Campgrounds.scss";
import { Suspense, useRef, useState } from "react";

import { Map, Source, Layer, Popup, NavigationControl } from "react-map-gl";
import {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer
} from "../../utils/layers";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const loadCampgrounds = async () => {
    const res = await fetch("/api/campgrounds");
    if (!res.ok) {
        const err = await res.json();
        throw {
            message: err.message,
            status: res.status,
            statusText: res.statusText
        };
    } else {
        const data = await res.json();
        return data;
    }
};

export const loader = async () => {
    return defer({ campgrounds: await loadCampgrounds() });
    // return loadCampgrounds();
};

const Campgrounds = () => {
    const { campgrounds } = useLoaderData();
    // const campgrounds = useLoaderData();
    const geoData = { features: campgrounds };
    const [popupInfo, setPopupInfo] = useState(null);
    const mapRef = useRef(null);

    const onClick = (event) => {
        const features = event.features || [];

        if (features.length > 0) {
            if (features[0].properties.cluster) {
                const clusterId = features[0].properties.cluster_id;
                const mapboxSource = mapRef.current.getSource("campgrounds");

                mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) {
                        return;
                    }
                    mapRef.current.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom,
                        duration: 500
                    });
                });
            } else {
                const campgroundInfo = JSON.parse(features[0].properties.popUp);
                setPopupInfo({
                    lngLat: features[0].geometry.coordinates,
                    info: campgroundInfo
                });
            }
        }
    };

    const renderCampgrounds = (campgrounds) => {
        return campgrounds.map((campground) => (
            <div key={campground._id} className="app__card">
                <div className="app__card-img">
                    <img alt="campground image" src={campground.images[0]} />
                </div>
                <div className="app__card-body">
                    <h2 className="app__card-title">{campground.title}</h2>
                    <p className="app__card-description">
                        {campground.description}
                    </p>
                    <p className="app__card-location">{campground.location}</p>
                    <Link to={campground._id}>View {campground.title}</Link>
                </div>
            </div>
        ));
    };

    return (
        <section className="app__campgrounds">
            <div className="app__mainMap">
                <Map
                    initialViewState={{
                        latitude: 40.67,
                        longitude: -103.59,
                        zoom: 3
                    }}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    interactiveLayerIds={[
                        clusterLayer.id,
                        unclusteredPointLayer.id
                    ]}
                    onClick={onClick}
                    ref={mapRef}>
                    <Source
                        id="campgrounds"
                        type="geojson"
                        data={geoData}
                        cluster={true}
                        clusterMaxZoom={14}
                        clusterRadius={50}>
                        <Layer {...clusterLayer} />
                        <Layer {...clusterCountLayer} />
                        <Layer {...unclusteredPointLayer} />
                    </Source>
                    {popupInfo !== null && (
                        <Popup
                            longitude={popupInfo.lngLat[0]}
                            latitude={popupInfo.lngLat[1]}
                            anchor="bottom"
                            onClose={() => setPopupInfo(null)}
                            closeOnClick={false}>
                            <Link
                                className="app__popupLink"
                                to={popupInfo.info.id}>
                                {popupInfo.info.title}
                            </Link>
                        </Popup>
                    )}
                    <NavigationControl />
                </Map>
            </div>
            <h2>All Campgrounds</h2>
            <Suspense
                fallback={
                    <h3 style={{ textAlign: "center", marginTop: "3rem" }}>
                        Loading...
                    </h3>
                }>
                <Await resolve={campgrounds}>{renderCampgrounds}</Await>
            </Suspense>
            {/* {renderCampgrounds(campgrounds)} */}
        </section>
    );
};

export default Campgrounds;
