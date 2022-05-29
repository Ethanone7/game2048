import React, {useState, useEffect, useRef, KeyboardEvent} from 'react';
import {Button, Row, Col} from 'antd';
import lodash from 'lodash';
import './index.css';

interface BoardProps {
  input?: string;
}

const CUBE_WIDTH = 107;
const CUBE_SIZE = 4;

const EMPTY_2D_ARRAY: number[][] = new Array(CUBE_SIZE)
  .fill(0)
  .map(() => new Array(CUBE_SIZE).fill(0));

const rotateUpDown = (inputArray: number[][]) => {
  const m = inputArray.length;
  const n = inputArray[0].length;
  const res = new Array(m).fill(0).map(() => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      res[i][j] = inputArray[m - i - 1][j];
    }
  }
  return res;
};

const rotateLeft = (inputArray: number[][]) => {
  const m = inputArray.length;
  const n = inputArray[0].length;
  const res = new Array(n).fill(0).map(() => new Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      res[i][j] = inputArray[j][n - 1 - i];
    }
  }
  return res;
};

const rotateRight = (inputArray: number[][]) => {
  const m = inputArray.length;
  const n = inputArray[0].length;
  const res = new Array(n).fill(0).map(() => new Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      res[i][j] = inputArray[n - 1 - j][i];
    }
  }
  return res;
};

const GameBoard: React.FC<BoardProps> = () => {
  const [displayArray, setDisplayArray] = useState<number[][]>(EMPTY_2D_ARRAY);
  const ref = useRef<number[][]>(EMPTY_2D_ARRAY);

  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.defaultPrevented) {
        return;
      }
      onHandleArrow(e.key, ref.current);
      setTimeout(() => {
        setDisplayArray(randomGenerate(ref.current));
      }, 0);
    });
    return () => {
      document.removeEventListener('keydown', e => {
        if (e.defaultPrevented) {
          return;
        }
        onHandleArrow(e.key, ref.current);
        setTimeout(() => {
          setDisplayArray(randomGenerate(ref.current));
        }, 0);
      });
    };
  }, []);

  useEffect(() => {
    setDisplayArray(randomGenerate(displayArray));
  }, []);

  useEffect(() => {
    ref.current = displayArray;
  }, [displayArray]);

  const onHandleArrow = (key: string, inputArray: number[][]) => {
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    ) {
      const upMove = (preArray: number[][]) => {
        const m = preArray.length;
        const n = preArray[0].length;
        const handleArray: number[][] = new Array(m)
          .fill(0)
          .map(() => new Array(n).fill(0));
        for (let i = 0; i < m; i++) {
          let tmpArray: number[] = [];
          for (let j = 0; j < n; j++) {
            if (preArray[j][i]) {
              tmpArray = [...tmpArray, preArray[j][i]];
            }
          }
          for (let j = 0; j < tmpArray.length; ) {
            if (j + 1 < tmpArray.length && tmpArray[j] === tmpArray[j + 1]) {
              tmpArray[j] += 1;
              tmpArray[j + 1] = 0;
              j++;
            }
            j++;
          }
          let array: number[] = [];
          for (const item of tmpArray) {
            if (item) {
              array = [...array, item];
            }
          }
          for (let j = 0; j < array.length; j++) {
            handleArray[j][i] = array[j];
          }
        }
        return handleArray;
      };
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        const preHandleArray =
          key === 'ArrowUp' ? inputArray : rotateUpDown(inputArray);
        const res = upMove(preHandleArray);
        setDisplayArray(key === 'ArrowUp' ? res : rotateUpDown(res));
        return;
      } else if (key === 'ArrowLeft') {
        setDisplayArray(rotateLeft(upMove(rotateRight(inputArray))));
        return;
      } else if (key === 'ArrowRight') {
        setDisplayArray(rotateRight(upMove(rotateLeft(inputArray))));
        return;
      } else {
        return;
      }
    }
  };

  const generateVal = (num: number) => {
    if (num > 0) {
      const floor_num = Math.floor(num);
      return Math.pow(2, floor_num).toString();
    }
    return '';
  };

  const randomGenerate = (inputArray: number[][]) => {
    let zeroArray: number[] = [];
    inputArray.flat().map((val, idx) => {
      if (val === 0) {
        zeroArray = [...zeroArray, idx];
      }
    });
    const randomIdx = Math.floor(Math.random() * zeroArray.length);
    const copyArray = [...inputArray.flat()];
    copyArray[randomIdx] = 1;
    return lodash.chunk(copyArray, CUBE_SIZE);
  };

  const onSetCubeLength = () => {
    return CUBE_WIDTH + 'px';
  };

  const onSetDivBGColor = (val: number) => {
    let colName = '';
    switch (val) {
      case 0:
        colName = 'rgba(238,228,218,.35)';
        break;
      case 1:
        colName = '#eee4da';
        break;
      case 2:
        colName = '#ede0c8';
        break;
      case 3:
        colName = '#f2b179';
        break;
      case 4:
        colName = '#f59563';
        break;
      case 5:
        colName = '#f67c5f';
        break;
      case 6:
        colName = '#f65e3b';
        break;
      case 7:
        colName = '#edcf72';
        break;
      case 8:
        colName = '#edcc61';
        break;
      case 9:
        colName = '#edc850';
        break;
      case 10:
        colName = '#edc53f';
        break;
      case 11:
        colName = '#edc22e';
        break;
    }
    return colName;
  };

  const onSetFontColor = (val: number) => {
    return val > 2 ? '#f9f6f2' : '#776e65';
  };

  const onSetFontSize = (val: number) => {
    if (val <= 6) {
      return '55px';
    } else if (val <= 9) {
      return '45px';
    } else if (val <= 13) {
      return '35px';
    } else {
      return '25px';
    }
  };

  const boardView = () => {
    return (
      <div style={{width: '470px'}}>
        {displayArray.map((list, row) => {
          return (
            <Row
              wrap={false}
              style={{
                display: 'flex',
                marginTop: row === 0 ? '15px' : '0px',
                marginBottom: '15px',
              }}
            >
              {list.map((val, col) => {
                return (
                  <Col span={Math.floor(24 / CUBE_SIZE)}>
                    <div
                      style={{
                        width: onSetCubeLength(),
                        height: onSetCubeLength(),
                        fontSize: onSetFontSize(val),
                        backgroundColor: onSetDivBGColor(val),
                        color: onSetFontColor(val),
                        borderRadius: '3px',
                        borderWidth: 0,
                        borderStyle: 'solid',
                        textAlign: 'center',
                        lineHeight: onSetCubeLength(),
                        fontFamily:
                          'clear sans,helvetica neue,Arial,sans-serif',
                        marginLeft: col === 0 ? '15px' : '7.5px',
                        marginRight: '7.5px',
                      }}
                      onClick={() => {
                        const copyArray = lodash.cloneDeep(displayArray);
                        copyArray[row][col]++;
                        setDisplayArray(copyArray);
                      }}
                    >
                      {generateVal(val)}
                    </div>
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          width: '500px',
          height: '500px',
          padding: '15px',
          margin: 'auto',
          borderRadius: '3px',
          backgroundColor: '#bbada0',
        }}
      >
        {boardView()}
      </div>
    </>
  );
};

export {GameBoard};
