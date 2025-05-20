import { el } from 'redom';
import { getBanks } from './api.js';

export function createMap() {
  const title = el('h1.ATMs__title', 'Карта');
  const map = el('div#map.ATMs__map');
  const container = el('div.ATMs', [title, map]);
  return container;
}

async function loadScriptYandexMaps() {
  const scriptSrc =
    'https://api-maps.yandex.ru/3.0/?apikey=787c01ce-41c0-4504-9ab8-8e1312feaa8d&lang=ru_RU';

  const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

  if (existingScript) {
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptSrc;

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error('Не удалось загрузить Яндекс.Карты'))
    );

    document.head.append(script);
  }).catch((error) => {
    console.error('Ошибка при загрузке Яндекс.Карт:', error);
    throw error;
  });
}

export async function initMap() {
  await loadScriptYandexMaps();
  await ymaps3.ready;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapDefaultFeaturesLayer,
    YMapMarker,
  } = ymaps3;

  const { YMapZoomControl, YMapGeolocationControl } = await ymaps3.import(
    '@yandex/ymaps3-controls@0.0.1'
  );

  const map = new YMap(document.getElementById('map'), {
    location: {
      center: [37.588144, 55.733842],
      zoom: 5,
    },
  });

  // Добавляем слой схемы карты (визуальное представление карты)
  map.addChild(new YMapDefaultSchemeLayer());
  // Добавляем слой географических объектов по умолчанию
  map.addChild(new YMapDefaultFeaturesLayer());
  // Добавляем элементы управления на карту
  map.addChild(
    new YMapControls({ position: 'right' }).addChild(new YMapZoomControl({}))
  );
  map.addChild(
    new YMapControls({ position: 'top right' }).addChild(
      new YMapGeolocationControl({})
    )
  );

  const CoordBanks = await getBanks();

  // Добавляем маркеры на карту
  CoordBanks.payload.forEach((coord) => {
    const marker = new YMapMarker({
      coordinates: [coord.lat, coord.lon],
      icon: {
        imageHref: markerIcon,
        imageSize: [30, 40],
        imageOffset: [-15, -40],
      },
      hint: 'Coin', // Текст отображается при наведении
      balloon: {
        content: 'Банк: Coin',
      },
    });

    map.addChild(marker);
  });
}
