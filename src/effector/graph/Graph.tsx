import React, { useEffect, useRef } from 'react';
// @ts-ignore
import cytoscape from 'cytoscape';
// @ts-ignore
import euler from 'cytoscape-euler';
import { traverse } from './utils';
import { fork } from 'effector';
// @ts-ignore
import dagre from 'cytoscape-dagre';

const elements = traverse();

export const Graph = () => {
    const ref = useRef<HTMLDivElement>(null);
    const cy = useRef<any>(null);

    useEffect(() => {
        cytoscape.use( dagre );
        cy.current = cytoscape({
            container: ref.current,
            // demo your layout
            layout: {
                name: 'dagre',
                directed: true,
                roots: '#9-stop',
                padding: 10,
                nodeDimensionsIncludeLabels: true,

                // some more options here...
            },

            boxSelectionEnabled: false,
            autounselectify: true,
          
            style: cytoscape.stylesheet()
              .selector('node')
                .style({
                  'content': 'data(caption)',
                  'shape': "data(type)"
                })
              .selector('edge')
                .style({
                  'curve-style': 'bezier',
                  'target-arrow-shape': 'triangle',
                  'width': 4,
                  'line-color': '#ddd',
                  'line-style': 'data(lineStyle)',
                  'target-arrow-color': '#ddd',
                  label: 'data(label)'
                })
                .selector('.highlighted')
                  .style({
                    'background-color': '#61bffc',
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                  })
                .selector('.effect')
                  .style({
                    'background-color': '#eb7b2f',
                    'line-color': '#eb7b2f',
                    'target-arrow-color': '#eb7b2f',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                  })

                .selector('.store')
                .style({
                  'background-color': '#a3a641',
                  'line-color': '#a3a641',
                  'target-arrow-color': '#a3a641',
                  'transition-property': 'background-color, line-color, target-arrow-color',
                  'transition-duration': '0.5s'
                }),
            elements
        });

        // var bfs = cy.current.elements().bfs('#9-stop', function(){}, true);
        // console.log(bfs)

        cy.current.nodes('[type = "round-tag"]').forEach((element: any) => {
          element.addClass('highlighted');
        });
        cy.current.nodes('[type = "star"]').forEach((element: any) => {
          element.addClass('effect');
        });
        cy.current.nodes('[type = "round-octagon"]').forEach((element: any) => {
          element.addClass('store');
        });

    
        // @ts-ignore

        // var i = 0;
        // var highlightNextEle = function(){
        // if( i < bfs.path.length ){
        //     bfs.path[i].addClass('highlighted');

        //     i++;
        //     setTimeout(highlightNextEle, 300);
        // }
        // };

        // // kick off first highlight
        // highlightNextEle();
    }, []);

    return (
        <div ref={ref} style={{ width: '1200px', height: '800px' }}>

        </div>
    );
};
