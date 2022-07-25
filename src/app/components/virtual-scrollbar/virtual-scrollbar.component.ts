import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-virtual-scrollbar',
  templateUrl: './virtual-scrollbar.component.html',
  styleUrls: ['./virtual-scrollbar.component.scss'],
})
export class VirtualScrollbarComponent implements OnInit {
  @ViewChild('wrapper', { read: ElementRef }) wrapper: ElementRef;
  @ViewChild('track', { read: ElementRef }) track: ElementRef;
  @Input() id = '';
  constructor() {}
  positionScroll = 0;
  movingTrack = false;
  startY = 0;
  trackTop = 0;
  clientSize = 0;
  scrollSize = 0;

  thumbSize = 0;
  trackSize = 0;
  elementScrollable: any;

  ngAfterViewInit() {
    this.setSizeScrollbar();
    this.elementScrollable = document.getElementById(this.id);
    this.elementScrollable.addEventListener('scroll', (e) => {
      let scrollTop = this.elementScrollable.scrollTop;
      console.log(scrollTop);
      this.trackTop = (scrollTop / this.scrollSize) * this.thumbSize;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.movingTrack) {
        this.clearSelection();
        var outWrapper = this.outWrapper(e);
        if (!outWrapper.out) {
          this.trackTop = e.clientY - this.startY;
        } else {
          if (e.clientY < this.thumbSize - this.trackSize) {
            this.trackTop = 0;
          } else {
            this.trackTop = this.thumbSize - this.trackSize;
          }
        }
        this.elementScrollable.scrollTop =
          (this.trackTop / this.thumbSize) * this.scrollSize;
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (this.movingTrack) {
        this.movingTrack = false;
      }
    });
  }

  ngOnInit() {}

  /**
   * Đặt kicks thước cho scrollbar
   * createdby ntdung5 25.07.2022
   */
  setSizeScrollbar() {
    var scrollable = document.getElementById(this.id);
    this.clientSize = scrollable.clientHeight;
    this.scrollSize = scrollable.scrollHeight;
    this.thumbSize = this.wrapper.nativeElement.getBoundingClientRect().height;
    this.trackSize = (this.clientSize / this.scrollSize) * this.thumbSize;
  }

  mousedownMain(e) {
    console.log(e);
  }

  mousedownTrack(e) {
    this.movingTrack = true;
    this.startY =
      e.clientY - parseInt(getComputedStyle(this.track.nativeElement).top);
  }

  /**
   * Xóa vùng đang chọn
   * createdby ntdung5 13.06.2022
   */
  clearSelection() {
    if (window.getSelection()) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    }
    // else if (document.selection) {
    //   document.selection.empty();
    // }
  }
  outWrapper(e) {
    if (
      e.clientY - this.startY >= 0 &&
      e.clientY - this.startY <= this.thumbSize - this.trackSize
    ) {
      return {
        out: false,
      };
    }
    return {
      out: true,
    };
  }
}
