import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'help-component',
  templateUrl: './help.component.html',
  styleUrls: ['help.component.scss'],
})
export class HelpComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
  }
}