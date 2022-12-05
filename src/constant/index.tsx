/* eslint-disable @next/next/no-img-element */
import { Button } from '@mui/material';
import {
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  StandaloneSearchBox,
  TrafficLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import axios from 'axios';
import type { NextPage } from 'next';
import { useTheme } from 'next-themes';
import { useCallback, useRef, useState } from 'react';
import { FiInfo, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useWindowSize } from 'react-use';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { API_KEY } from '@/constant/config';
import { mySwalOpts } from '@/constant/swal';
import clsxm from '@/lib/clsxm';
import toFixedIfNecessary from '@/lib/toFixedIfNecessary';
import { Prediction } from '@/types/prediction';

const MySwal = withReactContent(Swal);

const API_URL = 'https://quixotic-elf-357705.et.r.appspot.com';

const libraries = ['places'] as (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'visualization'
)[];

const Home: NextPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  const [destinationCnt, setDestinationCnt] = useState(2);
  const [destinations, setDestinations] = useState<string[]>(['', '']);
  const [starting, setStarting] = useState<string>('');
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [toggleMap, setToggleMap] = useState(true);

  const [predictionResult, setPredictionResult] = useState<Prediction>();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const count = useRef(0);

  const { width } = useWindowSize();

  const { theme } = useTheme();

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds({
      lat: -7.341492,
      lng: 112.715825,
    });
    map.fitBounds(bounds);
    map.setZoom(9);
    setMap(map);
  }, []);

  const onSubmit = async () => {
    if (destinations.length < 2) {
      toast.error('Berikan minimal 2 destinasi');
      return;
    }

    if (starting.length < 1) {
      toast.error('Berikan starting point!');
      return;
    }

    if (destinations.some((a) => a.length < 1)) {
      toast.error('Destinasi tidak boleh kosong!');
      return;
    }

    const payload = {
      locations: [starting, ...destinations],
    };

    setToggleMap(false);
    setLoading(true);
    setToggleMap(true);

    try {
      await toast.promise(
        axios.post<Prediction>(`${API_URL}/predict/`, payload),
        {
          pending: {
            render: () => {
              return 'Loading';
            },
          },
          success: {
            render: ({ data }) => {
              count.current = 0;
              setResponse(null);
              MySwal.fire({
                title: 'Hasil',
                icon: 'info',
                ...mySwalOpts(theme),
                html: (
                  <div className='flex max-w-lg flex-col gap-y-4'>
                    <div className='grid grid-cols-3 text-left'>
                      <p>Jarak Terdekat: </p>
                      <p className='col-span-2'>
                        {toFixedIfNecessary(data?.data.total_jarak ?? 6969, 2)}{' '}
                        km
                      </p>
                    </div>
                    <div className='grid grid-cols-3 text-left'>
                      <p>Rute: </p>
                      <ol className='col-span-2 list-inside list-decimal'>
                        {data?.data.rute_terdekat.map((v, i) => (
                          <li key={`${v}${i}`}>
                            <p className='inline font-bold'>{v}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ),
              });
              setPredictionResult(data?.data);
              return 'Berhasil!';
            },
          },
          error: {
            render: () => {
              return 'Error menentukan rute terbaik';
            },
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const directionsCallback = (
    res: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && count.current === 0 && res && response === null) {
      count.current++;
      setResponse(res);
    }
  };

  const onAutocompleteOnLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => setAutocomplete(autocomplete);

  const onPlaceChanged = (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setter: (a: any) => void
  ) => {
    if (autocomplete !== null) {
      autocomplete.getPlace();
      setTimeout(() => {
        const element = document.getElementById(id) as HTMLInputElement;
        setter(element.value);
      }, 69);
    }
  };

  return (
    <>
      <Seo />
      <Layout>
        <main>
          <section className='py-4'>
            <div className='layout flex flex-col items-center justify-center gap-y-6 text-center'>
              <div>
                <h1 className='text-xl md:text-3xl'>
                  Smart Route Planner with Google Maps API
                </h1>
              </div>
              <div className='flex items-center justify-center rounded-xl bg-rose-500 py-1 px-3'>
                <FiInfo className='text-8xl text-white' />
                <h2 className='text-sm text-white md:text-lg'>
                  Disclaimer: Hanya menjangkau tempat wisata yang ditempuh
                  melalui jalur darat dan dengan mode driving Google Maps.
                  Sejauh ini optimal untuk 3-10 tempat wisata (termasuk starting
                  point)
                </h2>
              </div>
              <div
                className={clsxm(
                  'grid justify-center gap-x-8 gap-y-4',
                  predictionResult && 'md:grid-cols-2'
                )}
              >
                <div className='flex items-center justify-center'>
                  <div className='flex flex-col gap-y-4 rounded-lg border-2 border-blue-300 p-4'>
                    {toggleMap && isLoaded && (
                      <Autocomplete
                        onLoad={onAutocompleteOnLoad}
                        onPlaceChanged={() =>
                          onPlaceChanged('starting-point', setStarting)
                        }
                      >
                        <Input
                          type='text'
                          placeholder='Masukkan starting point'
                          className=''
                          onChange={(e) => setStarting(e.target.value)}
                          value={starting}
                          id='starting-point'
                        />
                      </Autocomplete>
                    )}
                    <hr />
                    {[...Array(destinationCnt)].map((_, i) => (
                      <div
                        className='flex w-full items-center justify-center gap-x-2'
                        key={i}
                      >
                        {isLoaded && (
                          <Autocomplete
                            onLoad={onAutocompleteOnLoad}
                            onPlaceChanged={() =>
                              onPlaceChanged(
                                `destination-${i}`,
                                (e: string) => {
                                  const d = [...destinations];
                                  d[i] = e;
                                  setDestinations(d);
                                }
                              )
                            }
                          >
                            <Input
                              type='text'
                              placeholder='Masukkan destinasi'
                              value={destinations[i]}
                              key={i}
                              onChange={(e) => {
                                const d = [...destinations];
                                d[i] = e.target.value;
                                setDestinations(d);
                              }}
                              className='w-full'
                              id={`destination-${i}`}
                            />
                          </Autocomplete>
                        )}
                        {destinationCnt > 2 && (
                          <button
                            className='h-8 rounded-full bg-rose-600 p-2 hover:bg-rose-700 active:bg-rose-800'
                            onClick={() => {
                              const d = [...destinations];
                              d.splice(i, 1);
                              setDestinations(d);
                              setDestinationCnt((v) => v - 1);
                            }}
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    {destinationCnt < 9 && (
                      <Button
                        className='flex w-full items-center justify-center rounded-xl'
                        variant='contained'
                        color='success'
                        onClick={() => {
                          setDestinationCnt((v) => v + 1);
                          setDestinations([...destinations, '']);
                        }}
                        disabled={loading}
                      >
                        <FiPlus />
                      </Button>
                    )}
                    <Button
                      className='flex w-full items-center justify-center rounded-xl'
                      variant='contained'
                      onClick={() => {
                        onSubmit();
                      }}
                      disabled={loading}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                <div className='flex w-full items-center justify-center'>
                  {isLoaded && !loading && (
                    <GoogleMap
                      mapContainerStyle={{
                        width: Math.min(width * 0.9, 400),
                        height: Math.min(width * 0.9, 400),
                      }}
                      onLoad={onLoad}
                      onUnmount={() => console.log('Google Maps Unmount')}
                      mapContainerClassName={clsxm(
                        !predictionResult?.rute_terdekat && 'hidden'
                      )}
                    >
                      <StandaloneSearchBox
                        onLoad={(sb) => setSearchBox(sb)}
                        onPlacesChanged={() => {
                          const lat = searchBox
                            ?.getPlaces()?.[0]
                            .geometry?.location?.lat();
                          const lng = searchBox
                            ?.getPlaces()?.[0]
                            .geometry?.location?.lng();
                          if (lat != null && lng != null) {
                            map?.panTo({ lat, lng });
                            map?.setZoom(15);
                          }
                        }}
                      >
                        <input
                          type='text'
                          placeholder='Customized your placeholder'
                          style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `200px`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: 'absolute',
                            left: '50%',
                            bottom: '0%',
                            marginLeft: '-100px',
                          }}
                        />
                      </StandaloneSearchBox>
                      {predictionResult?.rute_terdekat &&
                        predictionResult.rute_terdekat.length > 2 && (
                          <DirectionsService
                            // required
                            options={{
                              origin: predictionResult.rute_terdekat[0],
                              destination:
                                predictionResult.rute_terdekat[
                                  predictionResult.rute_terdekat.length - 1
                                ],
                              waypoints: predictionResult.rute_terdekat
                                .slice(
                                  1,
                                  predictionResult.rute_terdekat.length - 1
                                )
                                .map((v) => ({
                                  location: v,
                                  stopover: true,
                                })),
                              provideRouteAlternatives: false,
                              travelMode: google.maps.TravelMode.DRIVING,
                              drivingOptions: {
                                departureTime: new Date(),
                                trafficModel:
                                  google.maps.TrafficModel.PESSIMISTIC,
                              },
                              unitSystem: google.maps.UnitSystem.METRIC,
                            }}
                            // required
                            callback={directionsCallback}
                            // optional
                            onLoad={(directionsService) => {
                              console.log(
                                'DirectionsService onLoad directionsService: ',
                                directionsService
                              );
                            }}
                            // optional
                            onUnmount={(directionsService) => {
                              console.log(
                                'DirectionsService onUnmount directionsService: ',
                                directionsService
                              );
                            }}
                          />
                        )}
                      {!loading && response && (
                        <>
                          <DirectionsRenderer
                            // required
                            options={{
                              directions: response,
                            }}
                            // optional
                            onLoad={(directionsRenderer) => {
                              console.log(
                                'DirectionsRenderer onLoad directionsRenderer: ',
                                directionsRenderer
                              );
                            }}
                            // optional
                            onUnmount={(directionsRenderer) => {
                              console.log(
                                'DirectionsRenderer onUnmount directionsRenderer: ',
                                directionsRenderer
                              );
                            }}
                          />
                          <TrafficLayer />
                        </>
                      )}
                    </GoogleMap>
                  )}
                </div>
                {predictionResult && (
                  <div className='whitespace-wrap flex h-fit flex-col gap-y-4 rounded-lg bg-green-200 p-4 text-left dark:bg-green-700'>
                    <h3>Hasil rekomendasi</h3>
                    <div className='grid grid-cols-2'>
                      <p>Jarak Terdekat: </p>
                      <p className='font-bold'>
                        {toFixedIfNecessary(
                          predictionResult.total_jarak ?? 6969,
                          2
                        )}{' '}
                        km
                      </p>
                    </div>
                    {response && (
                      <div className='grid grid-cols-2'>
                        <p>Durasi: </p>
                        <p className='font-bold'>
                          {(() => {
                            let secs =
                              response.routes[0].legs
                                .map((v) => v.duration?.value)
                                .reduce(
                                  (a, b) =>
                                    a !== undefined && b !== undefined
                                      ? a + b
                                      : b,
                                  0
                                ) ?? 0;
                            const hours = Math.floor(secs / 3600);
                            secs -= hours * 3600;
                            const mins = Math.floor(secs / 60);
                            secs -= mins * 60;
                            return `${hours ? hours + ' jam' : ''} ${
                              mins ? mins + ' menit' : ''
                            } ${secs ? secs + ' detik' : ''}`;
                          })()}
                        </p>
                      </div>
                    )}
                    <div className='grid grid-cols-2'>
                      <p>Rute: </p>
                      <ol className='list-inside list-decimal'>
                        {predictionResult.rute_terdekat.map((v, i) => (
                          <li key={`${v}${i}`}>
                            <p className='inline font-bold'>{v}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className='grid grid-cols-2'>
                      <p>Durasi per rute: </p>
                      <ul className='list-inside list-disc'>
                        {[
                          ...Array(predictionResult.rute_terdekat.length - 1),
                        ].map((_, i) => (
                          <li key={`durasi-rute-${i}`}>
                            <p className='inline font-bold'>
                              {i + 1} ke {i + 2}:{' '}
                              {response?.routes[0].legs[i]?.duration?.text
                                .replace(/hours?/gim, 'jam')
                                .replace(/mins?/gim, 'menit')
                                .replace(/minutes?/gim, 'menit')
                                .replace(/secs?/gim, 'detik')
                                .replace(/seconds?/gim, 'detik')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* <div className='grid grid-cols-2'>
                      <p>Jarak per rute: </p>
                      <ul className='list-inside list-disc'>
                        {[
                          ...Array(predictionResult.rute_terdekat.length - 1),
                        ].map((_, i) => (
                          <li key={`jarak-rute-${i}`}>
                            <p className='inline font-bold'>
                              {i + 1} ke {i + 2}:{' '}
                              {response?.routes[0].legs[i].distance?.text}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default Home;
