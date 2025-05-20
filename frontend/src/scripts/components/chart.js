function ratioTransaction (outgoing, incoming) {
  let incomingRatio;
  let outgoingRatio;

  if (incoming > outgoing) {
    incomingRatio = outgoing / incoming;
    outgoingRatio = 1 - incomingRatio;
  } else {
      outgoingRatio = incoming/ outgoing;
      incomingRatio = 1 - outgoingRatio
    }

  return {
    outgoingRatio,
    incomingRatio
  }
}

export function drawingColumnTransaction(data, ctx, chartHeight, padding, barWidth, barSpacing, maxBalance) {

  data.forEach((item, index) => {
    const { incomingRatio,  outgoingRatio } = ratioTransaction(item.transaction.outgoing, item.transaction.incoming);
    const barHeight = (item.transaction.balance / maxBalance) * (chartHeight - padding);
    const barHeightOutgoing = barHeight * outgoingRatio; // Высота столбца исходящих переводов
    const barHeightIncoming = barHeight * incomingRatio;// Высота столбца входящих переводов
    const x = barSpacing + (barWidth + barSpacing) * index;
    const yOutgoing = padding; // Координата по оси У для
    const yIncoming = padding + barHeightOutgoing;

    // Рисуем столбцы для исходящих транзакций (красный цвет)
    ctx.fillStyle = 'red';
    ctx.fillRect(x, yOutgoing, barWidth, barHeightOutgoing);

    // Рисуем столбцы для входящих транзакций (зеленый цвет)
    ctx.fillStyle = 'green';
    ctx.fillRect(x, yIncoming, barWidth, barHeightIncoming);
    // Подписываем месяцы под столбцами
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillStyle = 'black';
    ctx.font = '700 15px WorkSans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.month, x + barWidth / 2, 0);
    ctx.restore();
  });
}

export function drawingColumnsDinamic(data, ctx, chartHeight, padding, barWidth, barSpacing, maxBalance) {
   // Рисуем столбцы
  data.forEach((item, index) => {
    const barHeight = (item.transaction.balance / maxBalance) * (chartHeight - padding);
    const x = barSpacing + (barWidth + barSpacing) * index; // Позиция по оси X
    const y = padding; // Позиция по оси Y (внизу экрана)
    // Рисуем столбец
    ctx.fillStyle = 'blue'; // Цвет столбца
    ctx.fillRect(x, y, barWidth, barHeight); // Рисуем прямоугольник
    // Подписываем месяцы под столбцами
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillStyle = 'black';
    ctx.font = '700 15px WorkSans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.month, x + barWidth / 2, 0);
    ctx.restore();
  });
}

export function createChart(data, id, drawColumn) {
  const canvas = document.getElementById(id);

  if(!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  ctx.translate(0, canvas.height);
  ctx.scale(1,-1);

  const maxBalance = data.length > 0 ? Math.max(...data.map((item) => item.transaction.balance)) : 0;
  const minBalance = data.length > 0 ? Math.min(...data.map((item) => item.transaction.balance)) : 0;
  const maxIncoming = data.length > 0 ? Math.max(...data.map(item => item.transaction.incoming)) : 0;
  const maxOutgoing = data.length > 0 ? Math.max(...data.map(item => item.transaction.outgoing)) : 0;

  const minTransaction = Math.min(maxIncoming, maxOutgoing);


  const padding = 20;
  const paddingRight = 73;
  const barWidth = 50;
  const barSpacing = 30;

  // Высота и ширина области для столбцов
  const chartHeight = canvas.height;
  const chartWidth = canvas.width;

  // Рисуем ось Y
  ctx.beginPath();
  ctx.moveTo(0, padding);
  ctx.lineTo(0, chartHeight);
  ctx.moveTo(chartWidth - paddingRight - padding, padding);
  ctx.lineTo(chartWidth - paddingRight - padding, chartHeight);
  ctx.strokeStyle = 'black'; // Цвет линий
  ctx.stroke(); // Провести линии

  // Рисуем ось X
  ctx.moveTo(0, padding);
  ctx.lineTo(chartWidth - paddingRight - padding, padding);
  ctx.moveTo(chartWidth - paddingRight - padding, chartHeight);
  ctx.lineTo(0, chartHeight);
  ctx.strokeStyle = 'black'; // Цвет линий
  ctx.stroke(); // Провести линии

  // Подписываем минимальное значение у низа оси Y
  ctx.save();
  ctx.scale(1, -1);
  ctx.fillStyle = 'black';
  ctx.font = '500 15px WorkSans, sans-serif';
  ctx.fillText(`${minBalance.toFixed(0)} ₽`, chartWidth - paddingRight - 10, - padding);
  ctx.restore();

  // Подписываем максимальное значение у вершины оси Y
  ctx.save();
  ctx.scale(1, -1);
  ctx.fillStyle = "black";
  ctx.font = '500 15px WorkSans, sans-serif';
  ctx.fillText(`${maxBalance.toFixed(0)} ₽`, chartWidth - paddingRight - 10, - (chartHeight - padding));
  ctx.restore();

  if (id === 'chartTransactions') {
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillStyle = "black";
    ctx.font = '500 15px WorkSans, sans-serif';
    ctx.fillText(`${minTransaction.toFixed(0)} ₽`, chartWidth - paddingRight - 10, - ((chartHeight) / 2));
    ctx.restore();
  }

  drawColumn(data, ctx, chartHeight, padding, barWidth, barSpacing, maxBalance);
}

