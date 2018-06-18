// Copyright (c) 2015 - 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {CompositeLayer} from '@deck.gl/core';
import {PathLayer} from '@deck.gl/layers';
const DEFAULT_COLOR = [0, 0, 0, 255];

const defaultProps = {
  // grid
  cellSize: {type: 'number', min: 0, max: 1000, value: 1000},
  getPosition: x => x.position,

  // contour
  widthScale: 1,
  fp64: false,
  getThreshold: object => object.threshold,
  getColor: object => object.color || DEFAULT_COLOR,
  getWidth: object => object.width || 1
  // _TODO_ : specify any other PathLayer related props here
};

export default class ContourLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      contourData: []
    };
  }

  getSubLayerClass() {
    return PathLayer;
  }

  getSubLayerProps() {
    return super.getSubLayerProps({
      id: 'contour-path-layer',
      data: this.state.contourData,
      opacity: 0.6,
      getPath: f => f.path,
      getColor: f => [128, 0, 0],
      getWidth: f => 10
      // widthMinPixels: 1,
      // pickable: true
    });
  }

  updateState({oldProps, props, changeFlags}) {
    const aggregateData = oldProps.cellSize !== props.cellSize;
    if (changeFlags.dataChanged || aggregateData) {
      this._aggregateData();
    }
  }

  renderLayers() {
    const SubLayerClass = this.getSubLayerClass();

    return new SubLayerClass(this.getSubLayerProps());
  }

  // Private
  _aggregateData() {
    // Dummy contour data, replace with actual
    const positionOrigin = [-122.42694203247012, 37.751537058389985];
    const contourData = [
      {
        path: [
          [positionOrigin[0] - 0.005, positionOrigin[1] + 0.005],
          [positionOrigin[0] - 0.005, positionOrigin[1] - 0.005]
        ]
      }
    ];
    this.setState({contourData});
  }
}

ContourLayer.layerName = 'ContourLayer';
ContourLayer.defaultProps = defaultProps;
