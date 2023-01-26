import { LatLngExpression, LatLngTuple } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

const ChangeView = ({
  center,
  setCenter,
}: {
  center: LatLngExpression;
  setCenter: React.Dispatch<
    React.SetStateAction<LatLngExpression | LatLngTuple>
  >;
}) => {
  const map = useMap();
  const mapEvents = useMapEvents({
    click: (e) => {
      map.locate();
      map.setView(e.latlng);
      const { lat, lng } = e.latlng;
      setCenter([lat, lng]);
    },
  });

  map.setView(center, 20);
  return null;
};
export default ChangeView;
